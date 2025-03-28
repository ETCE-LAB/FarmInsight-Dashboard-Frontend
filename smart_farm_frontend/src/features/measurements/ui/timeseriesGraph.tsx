import React, { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import '@mantine/dates/styles.css';
import { requestMeasuremnt } from "../useCase/requestMeasurements";
import { receivedMeasurementEvent } from "../state/measurementSlice";
import { useAppSelector } from "../../../utils/Hooks";
import { Measurement } from "../models/measurement";
import { Card, Flex, Title, Notification, LoadingOverlay, Center, Text, Box, useMantineTheme } from "@mantine/core";
import { Sensor } from "../../sensor/models/Sensor";
import useWebSocket from "react-use-websocket";
import { getWebSocketToken } from "../../../utils/WebSocket/getWebSocketToken";
import { useMediaQuery } from '@mantine/hooks';

const TimeseriesGraph: React.FC<{ sensor: Sensor, dates:{from:string, to:string }| null }> = ({ sensor, dates }) => {
    const theme = useMantineTheme();
    const measurementReceivedEventListener = useAppSelector(receivedMeasurementEvent);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [shouldReconnect, setShouldReconnect] = useState<boolean>(false);
    const [socketURL, setSocketUrl] = useState<string | null>("ws://localhost");
    const [minXValue, setMinXValue] = useState<number>(10);
    const [maxXValue, setMaxXValue] = useState<number>(10);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Helper function to format the harvest amount
    // If the value has a fractional part, display with two decimals;
    // otherwise display as an integer.
    const formatHarvestAmount = (value: number): string => {
        return value % 1 === 0 ? value.toString() : value.toFixed(2);
    };

    // Helper function to format date as dd.mm
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };


    let { lastMessage } = useWebSocket(socketURL || "", {
        shouldReconnect: () => shouldReconnect,
        });


    const reconnectSocket = async () => {
        try {
            const resp = await getWebSocketToken();
            if (!resp) throw new Error("No WebSocket token received.");
            let baseUrl = process.env.REACT_APP_BACKEND_URL;
            if (!baseUrl) throw new Error("REACT_APP_BACKEND_URL is not configured.");
            baseUrl = baseUrl.replace(/^https?/, "wss").replace(/^http?/, "ws");
            setSocketUrl(`${baseUrl}/ws/sensor/${sensor?.id}?token=${encodeURIComponent(resp.token)}`);
            setShouldReconnect(true);
        } catch (err) {
            console.error(err);
            //setError("Failed to reconnect WebSocket.");
            setShouldReconnect(false);
        }
    };


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
            } catch (err) {
                console.error("Error processing WebSocket message:", err);
                setError("Failed to process incoming data.");
            }
        }
    }, [lastMessage]);



    useEffect(() => {
        if (sensor && false) {
            reconnectSocket();
        } else {
            setSocketUrl(null);
            setShouldReconnect(false);
        }
    }, [sensor]);

    useEffect(() => {
        setLoading(true);
        requestMeasuremnt(sensor.id, dates?.from, dates?.to)
            .then((resp) => {
                if (!resp) throw new Error("Failed to fetch measurements.");
                const roundedMeasurements = resp.map(m => ({
                    ...m,
                    value: parseFloat(m.value.toFixed(1))
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
        if (measurements.length > 0) {
            const values = measurements.map(m => m.value);
            setMinXValue(parseFloat((Math.min(...values) - 5).toFixed(1)));
            setMaxXValue(parseFloat((Math.max(...values) + 5).toFixed(1)));
        }
    }, [measurements]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Current measurement and previous three values
    const currentMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;
    const previousMeasurements = measurements.length > 1
        ? measurements.slice(Math.max(0, measurements.length - 4), measurements.length - 1)
        : [];

    return (
        <Flex style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
            <Card
                p="md"
                radius="md"
                style={{
                    marginBottom: '20px',
                    width: "100%",
                    boxSizing: 'border-box'
                }}
            >
                <Flex justify="space-between" align="center" mb="md" direction={{ base: "column", sm: "row" }}>
                    <Title order={4} c={theme.colors.blue[6]}>{sensor?.name}</Title>
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
                            // Mobile view: current value with time and date, and last three measurements with time and date
                            <Center style={{ flexDirection: 'column', width: '100%' }}>
                                {currentMeasurement ? (
                                    <>
                                        <Text size="xl" fw={700}>
                                            {formatHarvestAmount(currentMeasurement.value)} {sensor?.unit}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {new Date(currentMeasurement.measuredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {formatDate(currentMeasurement.measuredAt)}
                                        </Text>
                                        {previousMeasurements.length > 0 && (
                                            <Flex gap="xs" mt="sm" justify="center">
                                                {previousMeasurements.map((m, index) => (
                                                    <Box
                                                        key={index}
                                                        p="sm"
                                                        style={{
                                                            margin: '0 5px',
                                                            minWidth: 85,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <Text size="md" fw={500}>
                                                            {formatHarvestAmount(m.value)} {sensor?.unit}
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
                            // Desktop view: show chart only if there are measurements, else show text
                            measurements.length === 0 ? (
                                <Center style={{ height: '250px' }}>
                                    <Text c="dimmed">No data</Text>
                                </Center>
                            ) : (
                                <LineChart
                                    key={measurements.length}
                                    activeDotProps={{ r: 6, strokeWidth: 1 }}
                                    data={measurements.slice(-50)}
                                    dataKey="measuredAt"
                                    series={[{ name: "value", color: theme.colors.blue[6], label: sensor?.unit }]}
                                    curveType="monotone"
                                    style={{ borderRadius: '5px', padding: '10px', width: "100%" }}
                                    xAxisProps={{
                                        tickFormatter: (dateString) => {
                                            const date = new Date(dateString);
                                            return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' });
                                        }
                                    }}

                                    yAxisProps={{ domain: [minXValue, maxXValue] }}
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
                                                                {formatHarvestAmount(item.value)}{sensor?.unit}
                                                            </Flex>
                                                        ))}
                                                    </Card>
                                                );
                                            }
                                            return null;
                                        },
                                    }}
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
