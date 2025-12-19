import { Card, Text, useMantineTheme, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AreaChart } from '@mantine/charts';
import { WaterLevels } from '../../models/WeatherAndWaterStatus';

interface WaterLevelChartProps {
    data?: WaterLevels[];
}

export const WaterLevelChart = ({ data }: WaterLevelChartProps) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const chartData = Array.isArray(data) && data.length > 0 ? data : [];
    console.log(chartData);
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
            <Text fw={600} size="sm" mb="lg" c="dimmed">{t('water.waterLevelChartTitle')}</Text>

            {chartData.length > 0 ? (
                <AreaChart
                    h={300}
                    data={chartData}
                    dataKey="date"
                    series={[
                        { name: 'waterLevel', color: 'cyan.6' },
                    ]}
                    curveType="natural"
                    fillOpacity={0.2}
                    gridAxis="xy"
                    tickLine="none"
                    withYAxis={true}
                    withXAxis={true}
                    withTooltip={false}
                />
            ) : (
                <Center h={300}>
                    <Text c="dimmed">{t('water.noData')}</Text>
                </Center>
            )}
        </Card>
    );
};
