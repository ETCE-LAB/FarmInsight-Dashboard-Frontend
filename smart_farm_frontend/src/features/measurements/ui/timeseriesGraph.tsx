import React, { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import '@mantine/dates/styles.css';
import { requestMeasuremnt } from "../useCase/requestMeasurements";
import { receivedMeasurementEvent } from "../state/measurementSlice";
import { useAppSelector } from "../../../utils/Hooks";
import { Measurement } from "../models/measurement";
import { Button, Card, Flex, Text, Title } from "@mantine/core";
// @ts-ignore
import { IconZoomScan } from "@tabler/icons-react";
import {Sensor} from "../../sensor/models/Sensor";
import {receiveSensor} from "../../sensor/useCase/receiveSensor";

const TimeseriesGraph: React.FC<{sensor:Sensor}> = ({sensor}) => {

    const measurementReceivedEventListener = useAppSelector(receivedMeasurementEvent);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);



    useEffect(() => {
        requestMeasuremnt(sensor.id, "2024-10-10", "2024-11-01").then(resp => {
            if(resp) {
                // Round the values before setting them
                const roundedMeasurements = resp.map((measurement) => ({
                    ...measurement,
                    //TODO: "We might have to change this"
                    value: parseFloat(measurement.value.toFixed(2)),
                }));
                setMeasurements(roundedMeasurements);
            }
        });
    }, [measurementReceivedEventListener]);

    const calculateDomain = () => {
        if (measurements.length === 0) return [-10, 10];
        const values = measurements.map((item) => item.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const padding = 2;
        return [minValue - padding, maxValue + padding];
    };

    return (
        <Card p="lg" shadow="sm" radius="md" style={{ marginBottom: '30px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
            <Flex justify="space-between" align="center" mb="md">
                <Title order={3} style={{ color: '#199ff4' }}>{sensor?.name}</Title>
                <Button
                    variant="filled"
                    color="blue"
                    style={{ backgroundColor: '#105385' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0c4065'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#105385'}
                >
                    <IconZoomScan size={20} />
                </Button>
            </Flex>

            <LineChart
                data={measurements}
                dataKey="date"
                series={[{ name: "value", color: '#199ff4', label: sensor?.unit }]}
                curveType="monotone"
                style={{
                    borderRadius: '3px',
                    padding: '15px',
                }}
                xAxisProps={{
                    color: '#105385',
                    padding: { left: 30, right: 30 },
                }}
                yAxisProps={{
                    color: '#105385',
                    domain: calculateDomain(),
                }}
                h={185}
            />
        </Card>
    );
};

export default TimeseriesGraph;