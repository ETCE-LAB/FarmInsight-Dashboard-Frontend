import React, { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import '@mantine/dates/styles.css';
import { requestMeasuremnt } from "../useCase/requestMeasurements";
import { receivedMeasurementEvent } from "../state/measurementSlice";
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
    HoverCard,
} from "@mantine/core";
import { Sensor } from "../../sensor/models/Sensor";
import useWebSocket from "react-use-websocket";
import {useInterval, useMediaQuery} from '@mantine/hooks';
import {formatFloatValue, getSensorStateColor, getSensorStateColorHint, getWsUrl} from "../../../utils/utils";
import { Threshold } from "../../threshold/models/threshold";
import { LabelPosition } from "recharts/types/component/Label";
import { IconCircleFilled } from "@tabler/icons-react";

const TimeseriesGraph: React.FC<{ sensor: Sensor; dates: { from: string; to: string } | null }> = ({ sensor, dates }) => {
    const theme = useMantineTheme();
    const measurementReceivedEventListener = useAppSelector(receivedMeasurementEvent);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [sensorStatus, setSensorStatus] = useState<{ measuredAt: Date, isActive: boolean }>({ measuredAt: new Date(sensor.lastMeasurement.measuredAt), isActive: sensor.isActive });
    const [statusColor, setStatusColor] = useState(getSensorStateColor(sensorStatus.measuredAt, sensorStatus.isActive, sensor.intervalSeconds));

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    const { lastMessage } = useWebSocket(`${getWsUrl()}/ws/sensor/${sensor.id}`, {
        shouldReconnect: () => true,
    });

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

                setSensorStatus({
                    measuredAt: new Date(newMeasurements.at(-1).measuredAt),
                    isActive: true,
                });

                setStatusColor(getSensorStateColor(new Date(newMeasurements.at(-1).measuredAt), true, sensor.intervalSeconds));
            } catch (err) {
                console.error("Error processing WebSocket message:", err);
                setError("Failed to process incoming data.");
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        setLoading(true);
        requestMeasuremnt(sensor.id, dates?.from, dates?.to)
            .then((resp) => {
                if (!resp) throw new Error("Failed to fetch measurements.");
                const roundedMeasurements = resp.map(m => ({
                    ...m,
                    value: parseFloat(m.value.toFixed(1)),
                }));
                setMeasurements(roundedMeasurements);
            })
            .catch(err => {
                console.error("Error fetching measurements:", err);
                setError("Failed to fetch initial measurements.");
            })
            .finally(() => setLoading(false));
    }, [measurementReceivedEventListener, dates]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

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

    const interval = useInterval(() => setStatusColor(getSensorStateColor(sensorStatus.measuredAt, sensorStatus.isActive, sensor.intervalSeconds)), (sensor.intervalSeconds / 2) * 1000);

    useEffect(() => {
        interval.start();
    }, []);

    return (
        <Flex style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
            <Card p="md" radius="md" style={{ marginBottom: '20px', width: "100%", boxSizing: 'border-box' }}>
                <Flex gap="md" align="center" mb="md" direction={{ base: "column", sm: "row" }}>
                    <HoverCard>
                        <HoverCard.Target>
                            <IconCircleFilled size={20} color={statusColor} />
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Text size="sm">{getSensorStateColorHint((statusColor))}</Text>
                        </HoverCard.Dropdown>
                    </HoverCard>

                    <Title order={4} c={theme.colors.blue[6]}>{sensor.name}</Title>
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
                                <LineChart
                                    key={measurements.length}
                                    unit={sensor.unit}
                                    activeDotProps={{ r: 6, strokeWidth: 1 }}
                                    data={measurements.slice(-50)}
                                    dataKey="measuredAt"
                                    series={[{ name: "value", color: theme.colors.blue[6], label: sensor.unit }]}
                                    curveType="monotone"
                                    style={{ borderRadius: '5px', padding: '10px', width: "100%" }}
                                    xAxisProps={{
                                        tickFormatter: (dateString: string) => {
                                            const date = new Date(dateString);
                                            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        },
                                    }}
                                    // Hier die neue domain-Logik:
                                    yAxisProps={{
                                        domain: [
                                            (dataMin: number) => {
                                                const lowerBounds = sensor.thresholds
                                                    .map(t => t.lowerBound)
                                                    .filter((v): v is number => typeof v === 'number');
                                                const thresholdMin = lowerBounds.length > 0
                                                    ? Math.min(...lowerBounds)
                                                    : dataMin;
                                                return Math.min(dataMin, thresholdMin);
                                            },
                                            (dataMax: number) => {
                                                const upperBounds = sensor.thresholds
                                                    .map(t => t.upperBound)
                                                    .filter((v): v is number => typeof v === 'number');
                                                const thresholdMax = upperBounds.length > 0
                                                    ? Math.max(...upperBounds)
                                                    : dataMax;
                                                return Math.max(dataMax, thresholdMax);
                                            }
                                        ]
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
                            )
                        )}
                    </>
                )}
            </Card>
        </Flex>
    );
};

export default TimeseriesGraph;
