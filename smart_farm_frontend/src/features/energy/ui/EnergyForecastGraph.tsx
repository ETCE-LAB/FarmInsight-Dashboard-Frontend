import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LineChart } from '@mantine/charts';
import { Card, Title, Text, Group, Badge, Stack, Loader, Box } from '@mantine/core';
import { IconChartLine, IconSun, IconBolt } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { selectGraphData, selectEnergyLoading } from '../state/EnergySlice';
import { EnergyGraphDataPoint } from '../models/Energy';

interface ChartDataPoint {
    timestamp: string;
    dateLabel: string;
    historicalConsumption?: number;
    forecastConsumption?: number;
    forecastGenerationExpected?: number;
    forecastGenerationWorstCase?: number;
    forecastGenerationBestCase?: number;
}

/**
 * Format timestamp to readable date/time string
 */
const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format watt value for tooltip display
 */
const formatWattValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return '-';
    if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} kW`;
    }
    return `${value.toFixed(0)} W`;
};

export const EnergyForecastGraph: React.FC = () => {
    const { t } = useTranslation();
    const graphData = useSelector(selectGraphData);
    const isLoading = useSelector(selectEnergyLoading);

    // Transform graph data for the chart
    const chartData = useMemo<ChartDataPoint[]>(() => {
        if (!graphData) return [];

        // Create a map to combine all data points by timestamp
        const dataMap = new Map<string, ChartDataPoint>();

        // Helper to add data points to the map
        const addDataPoints = (
            points: EnergyGraphDataPoint[] | undefined,
            key: keyof ChartDataPoint
        ) => {
            if (!points) return;
            points.forEach((point) => {
                const existing = dataMap.get(point.timestamp) || {
                    timestamp: point.timestamp,
                    dateLabel: formatTimestamp(point.timestamp)
                };
                (existing as any)[key] = point.value_watts;
                dataMap.set(point.timestamp, existing);
            });
        };

        // Add all data series
        addDataPoints(graphData.historical_consumption, 'historicalConsumption');
        addDataPoints(graphData.forecast_consumption, 'forecastConsumption');
        addDataPoints(graphData.forecast_generation?.expected, 'forecastGenerationExpected');
        addDataPoints(graphData.forecast_generation?.worst_case, 'forecastGenerationWorstCase');
        addDataPoints(graphData.forecast_generation?.best_case, 'forecastGenerationBestCase');

        // Sort by timestamp and return as array
        return Array.from(dataMap.values()).sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }, [graphData]);

    // Define chart series
    const series = useMemo(() => [
        { name: 'historicalConsumption', color: 'red.6', label: t('energy.historicalConsumption') },
        { name: 'forecastConsumption', color: 'orange.6', label: t('energy.forecastConsumption') },
        { name: 'forecastGenerationExpected', color: 'green.6', label: t('energy.forecastExpected') },
        { name: 'forecastGenerationWorstCase', color: 'yellow.6', label: t('energy.forecastWorstCase') },
        { name: 'forecastGenerationBestCase', color: 'teal.6', label: t('energy.forecastBestCase') }
    ], [t]);

    // Check if we have any data to display
    const hasData = chartData.length > 0;

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
                <Group justify="space-between">
                    <Group gap="xs">
                        <IconChartLine size={24} />
                        <Title order={3}>{t('energy.forecastGraph')}</Title>
                    </Group>
                    <Group gap="xs">
                        <Badge leftSection={<IconBolt size={12} />} color="red" variant="light">
                            {t('energy.consumption')}
                        </Badge>
                        <Badge leftSection={<IconSun size={12} />} color="green" variant="light">
                            {t('energy.production')}
                        </Badge>
                    </Group>
                </Group>

                {/* Chart */}
                <LineChart
                    h={350}
                    data={chartData}
                    dataKey="dateLabel"
                    series={series}
                    curveType="monotone"
                    withLegend
                    withDots={false}
                    legendProps={{
                        verticalAlign: 'bottom',
                        align: 'center',
                        height: 60,
                        content: (props: any) => {
                            const items = props?.payload ?? [];
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 16,
                                        paddingTop: 12,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {items.map((item: any) => (
                                        <div
                                            key={item.value}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    background: item.color,
                                                    display: 'inline-block',
                                                }}
                                            />
                                            <span style={{ fontSize: '12px' }}>
                                                {series.find(s => s.name === item.value)?.label || item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        },
                    }}
                    tooltipProps={{
                        content: ({ label, payload }) => {
                            if (!payload || payload.length === 0) return null;
                            return (
                                <Card
                                    p="xs"
                                    radius="sm"
                                    style={{
                                        backgroundColor: 'var(--mantine-color-body)',
                                        border: '1px solid var(--mantine-color-default-border)'
                                    }}
                                >
                                    <Text fw={600} size="sm" mb="xs">{label}</Text>
                                    {payload.map((item: any) => (
                                        <Group key={item.name} justify="space-between" gap="md">
                                            <Group gap="xs">
                                                <span
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background: item.color,
                                                        display: 'inline-block',
                                                    }}
                                                />
                                                <Text size="xs">
                                                    {series.find(s => s.name === item.name)?.label || item.name}:
                                                </Text>
                                            </Group>
                                            <Text size="xs" fw={500}>
                                                {formatWattValue(item.value)}
                                            </Text>
                                        </Group>
                                    ))}
                                </Card>
                            );
                        },
                    }}
                    yAxisProps={{
                        tickFormatter: (value: number) => formatWattValue(value)
                    }}
                />
            </Stack>
        </Card>
    );
};

export default EnergyForecastGraph;
