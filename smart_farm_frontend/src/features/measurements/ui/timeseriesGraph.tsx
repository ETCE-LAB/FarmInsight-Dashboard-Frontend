import React, { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import '@mantine/dates/styles.css';
import { requestMeasuremnt } from "../useCase/requestMeasurements";
import {receivedMeasurementEvent} from "../state/measurementSlice";
import { useAppSelector } from "../../../utils/Hooks";
import { Measurement } from "../models/measurement";
import {
    Card,
    Flex,
    Title,
    Notification,
    LoadingOverlay,
    Center,
    Text,
    Box,
    useMantineTheme,
    HoverCard, Switch,
} from "@mantine/core";
import { Sensor } from "../../sensor/models/Sensor";
import useWebSocket from "react-use-websocket";
import {useInterval, useMediaQuery} from '@mantine/hooks';
import {
    formatFloatValue,
    getBackendTranslation,
    getSensorStateColor,
    getSensorStateColorHint,
    getWsUrl
} from "../../../utils/utils";
import { Threshold } from "../../threshold/models/threshold";
import { LabelPosition } from "recharts/types/component/Label";
import { IconCircleFilled } from "@tabler/icons-react";
import {useAuth} from "react-oidc-context";
import {useTranslation} from "react-i18next";


/**
 * Calculates "moving Average" for a specific range of values
 * @param measurements List with Measurements
 * @param windowSize - Number of measurements to summarize into one "averaged" value
 * @returns New measurements List with less values
 */
export function applyMovingAverage(
    measurements: Measurement[],
    windowSize: number
): Measurement[] {
    if (windowSize <= 0) {
        return [];
    }

    const result: Measurement[] = [];

    for (let i = 0; i < measurements.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = measurements.slice(start, i + 1);
        const average = window.reduce((sum, m) => sum + m.value, 0) / window.length;

        result.push({
            measuredAt: measurements[i].measuredAt,
            value: average,
        });
    }

    return result;
}

/**
 * Reduziert die Anzahl der Messwerte durch Downsampling.
 * @param measurements - Originale Liste der Messwerte
 * @param step - Nur jeder n-te Wert wird beibehalten
 * @returns Reduzierte Liste der Messwerte
 */
export function downsampleMeasurements(
    measurements: Measurement[],
    step: number
): Measurement[] {
    if (step <= 0) {
        throw new Error("Step must be greater than zero.");
    }

    return measurements.filter((_, index) => index % step === 0);
}

/* Method to calculate Watt to WH
* */
export function computeHourlyConsumption(measurements: Measurement[]) {
    if (measurements.length < 2) {
        return 0;
    }
    const sorted = [...measurements].sort(
        (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
    );

    let energyWh = 0;

    for (let i = 0; i < sorted.length - 1; i++) {
        const t0 = new Date(sorted[i].measuredAt).getTime();       // ms
        const t1 = new Date(sorted[i + 1].measuredAt).getTime();   // ms
        const dtSeconds = (t1 - t0) / 1_000;                       // s


        const pAvg = (sorted[i].value + sorted[i + 1].value) / 2;  // W
        energyWh += (pAvg * dtSeconds) / 3_600;                    // Wh
    }

    const durationSeconds =
        (new Date(sorted.at(-1)!.measuredAt).getTime() -
            new Date(sorted[0].measuredAt).getTime()) / 1_000;

    return (energyWh * 3_600) / durationSeconds;
}

const TimeseriesGraph: React.FC<{ sensor: Sensor; dates: { from: string; to: string } | null }> = ({ sensor, dates }) => {
    const { t, i18n } = useTranslation();
    const auth = useAuth();
    const theme = useMantineTheme();

    const measurementReceivedEventListener = useAppSelector(receivedMeasurementEvent);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [averagedMeasurements, setAveragedMeasurements] = useState<Measurement[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [sensorStatus, setSensorStatus] = useState<{ measuredAt: Date, isActive: boolean }>({ measuredAt: new Date(sensor.lastMeasurement.measuredAt), isActive: sensor.isActive });
    const [statusColor, setStatusColor] = useState(getSensorStateColor(sensorStatus.measuredAt, sensorStatus.isActive, sensor.intervalSeconds));
    const [aggregatedValues, setAggregatedValues] = useState<number>(0);
    const [aggregatedUnit, setAggregatedUnit] = useState<string>(sensor.unit);
    const [allowMovingAverage, setAllowMovingAverage] = useState<boolean>(false)
    const [calculateMovingAverage, setCalculateMovingAverage] = useState<boolean>(false)
    const [displayMoreThanOneDay, setDisplayMoreThanOneDay] = useState<boolean>(false)

    //The number of measurements averaged into one
    const movingAverageWindow  = measurements.length > 200 ? measurements.length * 0.01: 5

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    const { lastMessage } = useWebSocket(`${getWsUrl()}/ws/sensor/${sensor.id}`, {
        shouldReconnect: () => true,
    });

    // Aggregate Function and hardcoded Units
    useEffect(() => {
        if (sensor.aggregate && measurements.length > 0) {
            let sum: number;
            if(sensor.unit === 'W') {
                sum = calculateMovingAverage ? computeHourlyConsumption(averagedMeasurements):  computeHourlyConsumption(measurements);
                setAggregatedUnit('Wh');
            } else {
                sum = measurements.reduce((acc, cur) => acc + cur.value, 0);
            }
            setAggregatedValues(+sum.toFixed(2));
        }
    }, [measurements, sensor.aggregate, sensor.unit, calculateMovingAverage, averagedMeasurements]);

    //Apply Moving Average Algorithmus to thin out the graph and make it more readable
    useEffect(() => {
        if (calculateMovingAverage && Math.floor(measurements.length/300) > 2) {
            const averagedMeasurements = applyMovingAverage(measurements,movingAverageWindow)
            setAveragedMeasurements(averagedMeasurements)
        }

    }, [calculateMovingAverage, measurements, movingAverageWindow]);

    //Logic whether the Switch to apply MovingAverage Algorithem is displayed or not
    useEffect(() => {
        if (!calculateMovingAverage) {
            setAllowMovingAverage(false)
        }
        if (measurements.length >= 10) {
            setAllowMovingAverage(true)
        }
    }, [calculateMovingAverage, measurements]);

    useEffect(() => { setAllowMovingAverage(false) },[dates])

    useEffect(() => {
        if (lastMessage) {
            try {
                const data = JSON.parse(lastMessage.data);
                if (!data.measurement) throw new Error("Invalid WebSocket message format.");
                const newMeasurements = data.measurement.map((m: Measurement) => ({
                    value: Math.round(m.value * 100) / 100,
                    measuredAt: m.measuredAt,
                }));
                setMeasurements((prev) => [...prev, ...newMeasurements]);
                setAveragedMeasurements((prev) => [...prev, ...newMeasurements])

                setSensorStatus({
                    measuredAt: new Date(newMeasurements.at(-1).measuredAt),
                    isActive: true,
                });

                setStatusColor(getSensorStateColor(new Date(newMeasurements.at(-1).measuredAt), true, sensor.intervalSeconds));
            } catch (err) {
                console.error("Error processing WebSocket message:", err);
                setError(t('sensor.measurementsProcessError'));
            }
        }
    }, [lastMessage, sensor.intervalSeconds, t]);

    useEffect(() => {
        setLoading(true);
        requestMeasuremnt(sensor.id, dates?.from, dates?.to).then((resp) => {
            let roundedMeasurements = resp.map(m => ({
                ...m,
                value: parseFloat(m.value.toFixed(1)),
            }));
            setMeasurements(roundedMeasurements);
            setAveragedMeasurements(applyMovingAverage(roundedMeasurements, movingAverageWindow));
        }).catch(err => {
            console.error("Error fetching measurements:", err);
            setError(t('sensor.measurementsLoadError'));
        }).finally(() => setLoading(false));
    }, [measurementReceivedEventListener, dates, sensor.id, movingAverageWindow, t]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    //Display Dates on X-Axis if the ranged between first and least measurements is bigger than 1 Day
    useEffect(() => {
        if(measurements &&  measurements.length > 2){
            const first = new Date(measurements[0].measuredAt).getTime()
            const last = new Date(measurements[measurements.length - 1].measuredAt).getTime()
            setDisplayMoreThanOneDay(last - first > 24 * 60 * 60 * 1000)

        }
    }, [measurements]);

    const currentMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;
    const previousMeasurements = measurements.length > 1
        ? measurements.slice(Math.max(0, measurements.length - 4), measurements.length - 1)
        : [];

    const getThresholdLines = (thresholds: Threshold[]) => {
        const lines: any[] = [];
        try {
            for (const t of thresholds) {
                if (t.lowerBound != null && t.upperBound == null) {
                    lines.push({ y: t.lowerBound, label: t.description, color: t.color });
                }
                if (t.upperBound != null && t.lowerBound == null) {
                    lines.push({
                        y: t.upperBound,
                        label: t.description,
                        color: t.color,
                        labelPosition: 'insideTopLeft' as LabelPosition,
                    });
                }
                if (t.upperBound != null && t.lowerBound != null) {
                    lines.push({ y: t.lowerBound, label: t.description, color: t.color });
                    lines.push({ y: t.upperBound, color: t.color });
                }
            }
        } catch (e) {
            console.error("Error processing thresholds:", e);
        }
        return lines;
    };


    useInterval(() => setStatusColor(getSensorStateColor(sensorStatus.measuredAt, sensorStatus.isActive, sensor.intervalSeconds)), Math.min((sensor.intervalSeconds / 2) * 1000, 10 * 1000), { autoInvoke: true });

    return (
        <Flex style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
            <Card p="md" radius="md" style={{ marginBottom: '20px', width: "100%", boxSizing: 'border-box' }}>
                <Flex gap="md" align="center" mb="md" direction={{ base: "column", sm: "row" }}>
                    {auth.isAuthenticated &&
                        <HoverCard>
                            <HoverCard.Target>
                                <IconCircleFilled size={20} color={statusColor} />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">{getSensorStateColorHint((statusColor))}</Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    }
                    <Title order={4} c={theme.colors.blue[6]}>{getBackendTranslation(sensor.name, i18n.language)}</Title>
                    {allowMovingAverage && (
                        <Switch
                            style={{float: "right" } }
                            label={t("sensor.movingAverage")}
                            onChange={e => {setCalculateMovingAverage(e.currentTarget.checked)}}
                        />
                    )}
                </Flex>

                {error ? (
                    <Center style={{ height: '250px' }}>
                        <Notification color="red" onClose={() => setError(null)}>
                            {error}
                        </Notification>
                    </Center>
                ) : (
                    <>
                        {isMobile ? (
                            <Center style={{ flexDirection: 'column', width: '100%' }}>
                                {currentMeasurement ? (
                                    <>
                                        <Text size="xl" fw={700}>
                                            {formatFloatValue(currentMeasurement.value)} {sensor.unit}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {new Date(currentMeasurement.measuredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {formatDate(currentMeasurement.measuredAt)}
                                        </Text>
                                        {previousMeasurements.length > 0 && (
                                            <Flex gap="xs" mt="sm" justify="center">
                                                {previousMeasurements.map((m, idx) => (
                                                    <Box key={idx} p="sm" style={{ margin: '0 5px', minWidth: 85, textAlign: 'center' }}>
                                                        <Text size="md" fw={500}>
                                                            {formatFloatValue(m.value)} {sensor.unit}
                                                        </Text>
                                                        <Text size="sm" c="dimmed">
                                                            {new Date(m.measuredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </Text>
                                                        <Text size="xs" c="dimmed">
                                                            {formatDate(m.measuredAt)}
                                                        </Text>
                                                    </Box>
                                                ))}
                                            </Flex>
                                        )}
                                    </>
                                ) : (
                                    <Text c="dimmed">No data</Text>
                                )}
                            </Center>
                        ) : (
                            measurements.length === 0 ? (
                                <Center style={{ height: '250px' }}>
                                    <Text c="dimmed">No data</Text>
                                </Center>
                            ) : (
                                <>
                                    <LineChart
                                        key={measurements.length}
                                        unit={sensor.unit}
                                        activeDotProps={{ r: 6, strokeWidth: 1 }}
                                        data={calculateMovingAverage ?  averagedMeasurements: measurements}
                                        dataKey="measuredAt"
                                        series={[{ name: "value", color: theme.colors.blue[6], label: sensor.unit }]}
                                        curveType="monotone"
                                        style={{ borderRadius: '5px', padding: '10px', width: "100%"  }}
                                        //yAxisLabel={sensor.unit}
                                        xAxisProps={{
                                            tickFormatter: (dateString: string) => {
                                                const date = new Date(dateString);
                                                //If we display more than one day than display dates instead of Time
                                                return displayMoreThanOneDay
                                                    ? date.toLocaleDateString('de-DE')
                                                    : date.toLocaleTimeString('de-DE', {hour:'2-digit', minute: '2-digit'
                                                    })
                                                 //return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            },
                                        }}
                                        // Hier die neue domain-Logik:
                                        yAxisProps={{
                                            width:90,
                                            domain: [
                                                (dataMin: number) => {
                                                    const lowerBounds = sensor.thresholds
                                                        .map(t => t.lowerBound)
                                                        .filter((v): v is number => v !== null);
                                                    const thresholdMin = lowerBounds.length > 0
                                                        ? Math.min(...lowerBounds)
                                                        : dataMin;
                                                    return Math.min(dataMin, thresholdMin);
                                                },
                                                (dataMax: number) => {
                                                    const upperBounds = sensor.thresholds
                                                        .map(t => t.upperBound)
                                                        .filter((v): v is number => v !== null);
                                                    const thresholdMax = upperBounds.length > 0
                                                        ? Math.max(...upperBounds)
                                                        : dataMax;
                                                    return Math.max(dataMax, thresholdMax);
                                                }
                                            ],
                                            padding: {top: 3, bottom: 3},
                                            tickFormatter: (numberStr: string) => {
                                                return formatFloatValue(parseFloat(numberStr));
                                            },
                                        }}
                                        h={250}
                                        tooltipAnimationDuration={200}
                                        tooltipProps={{
                                            content: ({ label, payload }) => {
                                                if (payload && payload.length > 0) {
                                                    return (
                                                        <Card color="grey">
                                                            <strong>
                                                                {new Date(label).toLocaleDateString([], {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </strong>
                                                            {payload.map((item) => (
                                                                <Flex key={item.name}>
                                                                    {formatFloatValue(item.value)}{sensor.unit}
                                                                </Flex>
                                                            ))}
                                                        </Card>
                                                    );
                                                }
                                                return null;
                                            },
                                        }}
                                        referenceLines={getThresholdLines(sensor.thresholds)}
                                    />
                                    {sensor.aggregate && (
                                        <Text>{t('sensor.aggregatedValues')}: {aggregatedValues} {aggregatedUnit}</Text>
                                    )}
                                </>
                            )
                        )}
                    </>
                )}
            </Card>
        </Flex>
    );
};

export default TimeseriesGraph;
