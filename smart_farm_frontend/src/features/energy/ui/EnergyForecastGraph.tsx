import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart } from '@mantine/charts';
import { Card, Title, Text, Group, Badge, Stack, Loader, Box, SegmentedControl } from '@mantine/core';
import { IconChartLine, IconBattery } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { selectGraphData, selectEnergyLoading, selectBatteryLevel } from '../state/EnergySlice';
import { BatterySoCDataPoint } from '../models/Energy';

interface ChartDataPoint {
    timestamp: string;
    dateLabel: string;
    batterySoCExpected?: number;
    batterySoCWorstCase?: number;
    batterySoCBestCase?: number;
    currentLevel?: number;
}

/**
 * Format Wh value for display
 */
const formatWhValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return '-';
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)} kWh`;
    }
    return `${Math.round(value)} Wh`;
};

export const EnergyForecastGraph: React.FC = () => {
    const { t } = useTranslation();
    const graphData = useSelector(selectGraphData);
    const isLoading = useSelector(selectEnergyLoading);
    const currentBatteryLevel = useSelector(selectBatteryLevel);
    const [forecastDays, setForecastDays] = useState<string>('7');

    const selectedDays = parseInt(forecastDays);
    const filteredHours = selectedDays * 24;

    // Transform graph data for the chart
    const chartData = useMemo<ChartDataPoint[]>(() => {
        if (!graphData?.battery_soc) return [];

        const dataMap = new Map<string, ChartDataPoint>();

        const addDataPoints = (
            points: BatterySoCDataPoint[] | undefined,
            key: keyof ChartDataPoint
        ) => {
            if (!points) return;
            points.forEach((point) => {
                const existing = dataMap.get(point.timestamp) || {
                    timestamp: point.timestamp,
                    dateLabel: ''
                };
                (existing as any)[key] = point.value_wh;
                dataMap.set(point.timestamp, existing);
            });
        };

        addDataPoints(graphData.battery_soc.expected, 'batterySoCExpected');
        addDataPoints(graphData.battery_soc.worst_case, 'batterySoCWorstCase');
        addDataPoints(graphData.battery_soc.best_case, 'batterySoCBestCase');

        // Sort and slice
        const sortedData = Array.from(dataMap.values())
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .slice(0, filteredHours);

        // Format labels based on selected days
        return sortedData.map((point, index) => {
            const date = new Date(point.timestamp);
            const hour = date.getHours();

            let label = '';

            if (selectedDays === 1) {
                // 1 day: show every 3 hours
                if (hour % 3 === 0) {
                    label = `${hour}:00`;
                }
            } else if (selectedDays === 3) {
                // 3 days: show every 6 hours, date at midnight
                if (hour % 6 === 0) {
                    label = hour === 0
                        ? date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
                        : `${hour}:00`;
                }
            } else if (selectedDays === 7) {
                // 7 days: show date at midnight only
                if (hour === 0) {
                    label = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
                }
            } else {
                // 14 days: show date every 2 days at midnight
                if (hour === 0 && (index / 24) % 2 === 0) {
                    label = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
                }
            }

            return {
                ...point,
                dateLabel: label,
                currentLevel: currentBatteryLevel > 0 ? currentBatteryLevel : undefined
            };
        });
    }, [graphData, filteredHours, selectedDays, currentBatteryLevel]);

    // Chart series
    const series = useMemo(() => {
        const baseSeries = [
            { name: 'batterySoCExpected', color: 'blue.6', label: t('energy.batterySoCExpected') },
            { name: 'batterySoCWorstCase', color: 'orange.5', label: t('energy.batterySoCWorstCase') },
            { name: 'batterySoCBestCase', color: 'green.5', label: t('energy.batterySoCBestCase') }
        ];

        if (currentBatteryLevel > 0) {
            baseSeries.push({
                name: 'currentLevel',
                color: 'red.6',
                label: t('energy.currentLevel')
            });
        }

        return baseSeries;
    }, [t, currentBatteryLevel]);

    const labelMap = useMemo(() => {
        return new Map(chartData.map(d => [d.timestamp, d.dateLabel]));
    }, [chartData]);

    const hasData = chartData.length > 0;
    const batteryMaxWh = graphData?.battery_max_wh || 1600;

    if (isLoading && !hasData) {
        return (
            <Card shadow="sm" padding="lg" withBorder>
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <Loader size="lg" />
                </Box>
            </Card>
        );
    }

    if (!hasData) {
        return (
            <Card shadow="sm" padding="lg" withBorder>
                <Group justify="space-between" mb="md">
                    <Group gap="xs">
                        <IconChartLine size={24} />
                        <Title order={3}>{t('energy.forecastGraph')}</Title>
                    </Group>
                </Group>
                <Text c="dimmed" ta="center" py="xl">
                    {t('energy.noForecastData')}
                </Text>
            </Card>
        );
    }

    return (
        <Card shadow="sm" padding="lg" withBorder>
            <Stack gap="md">
                {/* Header */}
                <Group justify="space-between" wrap="wrap">
                    <Group gap="xs">
                        <IconChartLine size={24} />
                        <Title order={3}>{t('energy.forecastGraph')}</Title>
                    </Group>
                    <Group gap="sm">
                        <SegmentedControl
                            size="xs"
                            value={forecastDays}
                            onChange={setForecastDays}
                            data={[
                                { label: t('energy.days1'), value: '1' },
                                { label: t('energy.days3'), value: '3' },
                                { label: t('energy.days7'), value: '7' },
                                { label: t('energy.days14'), value: '14' }
                            ]}
                        />
                        <Badge leftSection={<IconBattery size={12} />} color="blue" variant="light">
                            {t('energy.batterySoC')}
                        </Badge>
                    </Group>
                </Group>

                {/* Battery info */}
                <Text size="xs" c="dimmed">
                    {t('energy.maxBatteryCapacity')}: {formatWhValue(batteryMaxWh)}
                    {currentBatteryLevel > 0 && (
                        <> · <Text span c="red.6" inherit>{t('energy.currentLevel')}: {formatWhValue(currentBatteryLevel)}</Text></>
                    )}
                </Text>

                {/* Chart */}
                <Box style={{ width: '100%', minHeight: 320 }}>
                    <LineChart
                        h={320}
                        data={chartData}
                        dataKey="timestamp"
                        series={series}
                        curveType="monotone"
                        withDots={false}
                        strokeWidth={2}
                        yAxisProps={{
                            tickFormatter: (value: number) => formatWhValue(value),
                            width: 70
                        }}
                        xAxisProps={{
                            interval: 0,
                            tickFormatter: (value: string) => labelMap.get(value) || ''
                        }}
                        gridProps={{ strokeDasharray: '3 3' }}
                        tooltipProps={{
                            content: ({ payload }) => {
                                if (!payload || payload.length === 0) return null;
                                const dataPoint = payload[0]?.payload as ChartDataPoint;
                                const timestamp = dataPoint?.timestamp;
                                if (!timestamp) return null;

                                const date = new Date(timestamp);
                                const formattedDate = date.toLocaleDateString('de-DE', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <Card p="xs" radius="sm" style={{
                                        backgroundColor: 'var(--mantine-color-body)',
                                        border: '1px solid var(--mantine-color-default-border)'
                                    }}>
                                        <Text fw={600} size="sm" mb="xs">{formattedDate}</Text>
                                        {payload.filter((item: any) => item.name !== 'currentLevel').map((item: any) => (
                                            <Group key={item.name} justify="space-between" gap="md">
                                                <Group gap="xs">
                                                    <span style={{
                                                        width: 8, height: 8, borderRadius: '50%',
                                                        background: item.color, display: 'inline-block'
                                                    }} />
                                                    <Text size="xs">{series.find(s => s.name === item.name)?.label}:</Text>
                                                </Group>
                                                <Text size="xs" fw={500}>{formatWhValue(item.value)}</Text>
                                            </Group>
                                        ))}
                                    </Card>
                                );
                            },
                        }}
                    />
                </Box>

                {/* Legend below chart */}
                <Group justify="center" gap="lg" wrap="wrap">
                    {series.map((s) => (
                        <Group key={s.name} gap={6}>
                            <Box style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: `var(--mantine-color-${s.color.replace('.', '-')})`
                            }} />
                            <Text size="xs">{s.label}</Text>
                        </Group>
                    ))}
                </Group>
            </Stack>
        </Card>
    );
};

export default EnergyForecastGraph;