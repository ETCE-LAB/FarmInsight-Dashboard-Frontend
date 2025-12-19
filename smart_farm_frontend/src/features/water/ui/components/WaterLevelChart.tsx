import { Card, Text, useMantineTheme } from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { WaterUsageData } from '../../models/WeatherAndWaterStatus';

interface WaterLevelChartProps {
    data?: WaterUsageData[];
}

export const WaterLevelChart = ({ data }: WaterLevelChartProps) => {
    const theme = useMantineTheme();

    const chartData = data && data.length > 0 ? data : [
        { date: 'Mon', level: 120 },
        { date: 'Tue', level: 140 },
        { date: 'Wed', level: 110 },
        { date: 'Thu', level: 150 },
        { date: 'Fri', level: 130 },
        { date: 'Sat', level: 90 },
        { date: 'Sun', level: 80 },
    ];

    return (
        <Card
            radius="md"
            p="md"
            style={{
                background: 'rgba(26, 27, 30, 0.6)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.dark[4]}`
            }}
        >
            <Text fw={600} size="sm" mb="lg" c="dimmed">Water Level (Last 7 Days)</Text>

            <AreaChart
                h={300}
                data={chartData}
                dataKey="date"
                series={[
                    { name: 'level', color: 'cyan.6' },
                ]}
                curveType="natural"
                fillOpacity={0.2}
                gridAxis="xy"
                tickLine="none"
                withYAxis={true}
                withXAxis={true}
                withTooltip={false}
            />
        </Card>
    );
};
