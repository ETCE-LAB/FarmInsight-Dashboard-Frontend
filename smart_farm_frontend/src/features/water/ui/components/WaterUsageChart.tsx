import { Card, Text, useMantineTheme } from '@mantine/core';
import { AreaChart } from '@mantine/charts';

export const WaterUsageChart = () => {
    const theme = useMantineTheme();

    const data = [
        { date: 'Mon', usage: 120 },
        { date: 'Tue', usage: 140 },
        { date: 'Wed', usage: 110 },
        { date: 'Thu', usage: 150 },
        { date: 'Fri', usage: 130 },
        { date: 'Sat', usage: 90 },
        { date: 'Sun', usage: 80 },
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
            <Text fw={600} size="sm" mb="lg" c="dimmed">Water Consumption (Last 7 Days)</Text>

            <AreaChart
                h={300}
                data={data}
                dataKey="date"
                series={[
                    { name: 'usage', color: 'cyan.6' },
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
