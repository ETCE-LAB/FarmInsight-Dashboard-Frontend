import React, { useState } from 'react';
import { Container, Title, SimpleGrid, Box, Grid, Card, Group, Text, ThemeIcon, ActionIcon, SegmentedControl, Center, Slider, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PredictionView } from '../../model/ui/PredictionView';
import { WaterTank } from './components/WaterTank';
import { PipeDistribution } from './components/PipeDistribution';
import { WaterUsageChart } from './components/WaterUsageChart';
import { FieldMoistureMap } from './components/FieldMoistureMap';
import { AiInsightOrb } from './components/AiInsightOrb';
import { IconDroplet, IconActivity, IconTopologyStar3, IconRefresh, IconAlertTriangle, IconCheck, IconSun, IconCloudRain, IconCloud, IconThermometer } from '@tabler/icons-react';

export const WaterDashboard = () => {
    const { t } = useTranslation();
    const { fpfId } = useParams<{ fpfId: string }>();

    // Mock Data State
    const [waterLevel] = useState(75);
    const [capacity] = useState(1000);
    const [dailyUsage] = useState(120);
    const [pumpStatus] = useState<'active' | 'inactive' | 'error'>('active');

    // Interactive State for Visual Demo
    const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy'>('sunny');
    const [temperature, setTemperature] = useState(22); // Default 22 degrees Celsius

    const getStatusColor = (level: number) => {
        if (level < 20) return 'red';
        if (level < 40) return 'yellow';
        return 'green';
    };

    const StatusCard = ({ title, value, subtext, icon, color }: any) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
                <Text fw={500} size="sm" c="dimmed">{title}</Text>
                <ThemeIcon variant="light" color={color} size="md" radius="md">
                    {icon}
                </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs">
                <Text fw={700} size="xl">{value}</Text>
            </Group>
            {subtext && <Text size="xs" c="dimmed" mt={4}>{subtext}</Text>}
        </Card>
    );

    return (
        <Container fluid p="md" style={{ position: 'relative' }}>
            {/* AI Insight Orb - Floating Action Button Style */}
            <Box style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000 }}>
                <AiInsightOrb />
            </Box>

            {/* Header */}
            <Group justify="space-between" mb="lg">
                <Group>
                    <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                        <IconDroplet size={20} />
                    </ThemeIcon>
                    <Title order={2}>{t('water.dashboardTitle', 'Water Management')}</Title>
                </Group>

                <Group>
                    {/* Temperature Control */}
                    <Box w={200} mr="md">
                        <Group gap={5} mb={5} justify="space-between">
                            <Group gap={5}>
                                <IconThermometer size={14} />
                                <Text size="xs" fw={500}>{temperature}°C</Text>
                            </Group>
                            {temperature <= 0 && <Badge size="xs" color="cyan" variant="light">FROZEN</Badge>}
                        </Group>
                        <Slider
                            value={temperature}
                            onChange={setTemperature}
                            min={-10}
                            max={40}
                            color={temperature <= 0 ? 'cyan' : 'orange'}
                            size="sm"
                            marks={[
                                { value: 0, label: '0°' },
                                { value: 20, label: '20°' },
                            ]}
                        />
                    </Box>

                    {/* Weather Controls (Demo) */}
                    <SegmentedControl
                        value={weather}
                        onChange={(value) => setWeather(value as 'sunny' | 'rainy' | 'cloudy')}
                        data={[
                            { label: <Center><IconSun size={16} /> <Text size="xs" ml={5}>Sunny</Text></Center>, value: 'sunny' },
                            { label: <Center><IconCloud size={16} /> <Text size="xs" ml={5}>Cloudy</Text></Center>, value: 'cloudy' },
                            { label: <Center><IconCloudRain size={16} /> <Text size="xs" ml={5}>Rainy</Text></Center>, value: 'rainy' },
                        ]}
                    />

                    <ActionIcon variant="light" size="lg">
                        <IconRefresh size={20} />
                    </ActionIcon>
                </Group>
            </Group>

            {/* Status Overview Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
                <StatusCard
                    title={t('water.currentLevel', 'Current Level')}
                    value={`${waterLevel}%`}
                    subtext={`${((waterLevel / 100) * capacity).toFixed(0)} Liters available`}
                    icon={<IconDroplet size={18} />}
                    color={getStatusColor(waterLevel)}
                />
                <StatusCard
                    title={t('water.systemStatus', 'System Status')}
                    value={waterLevel < 20 ? 'Critical' : 'Normal'}
                    subtext={waterLevel < 20 ? 'Water level low' : 'Everything looks good'}
                    icon={waterLevel < 20 ? <IconAlertTriangle size={18} /> : <IconCheck size={18} />}
                    color={waterLevel < 20 ? 'red' : 'green'}
                />
                <StatusCard
                    title={t('water.dailyUsage', 'Daily Usage')}
                    value={`${dailyUsage} L`}
                    subtext="Average: 115 L / day"
                    icon={<IconActivity size={18} />}
                    color="blue"
                />
                <StatusCard
                    title={t('water.pumpStatus', 'Pump Status')}
                    value={pumpStatus === 'active' ? 'Running' : 'Stopped'}
                    subtext="Last started: 2 hours ago"
                    icon={<IconTopologyStar3 size={18} />}
                    color={pumpStatus === 'active' ? 'green' : 'gray'}
                />
            </SimpleGrid>

            {/* Main Content Grid */}
            <Grid gutter="xl">
                {/* Left Column: Water Tank & Distribution */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-md)' }}>
                        {/* Tank */}
                        <Box style={{ flexGrow: 1, minHeight: 400 }}>
                            <WaterTank level={waterLevel} capacity={capacity} weather={weather} temperature={temperature} />
                        </Box>

                        {/* Pipe Distribution System */}
                        <Card withBorder radius="md" p="md">
                            <Text fw={600} size="sm" mb="sm" c="dimmed">Distribution Network</Text>
                            <PipeDistribution active={pumpStatus === 'active'} />
                        </Card>
                    </Box>
                </Grid.Col>

                {/* Right Column: Analytics & Predictions */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-md)', height: '100%' }}>

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                            {/* Glassmorphism Usage Chart */}
                            <WaterUsageChart />

                            {/* Field Moisture Heatmap */}
                            <FieldMoistureMap />
                        </SimpleGrid>

                        {/* Predictions */}
                        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flexGrow: 1 }}>
                            <Title order={3} mb="lg" size="h4">{t('water.modelsTitle', 'Water Consumption Forecast')}</Title>
                            {fpfId ? (
                                <PredictionView fpfId={fpfId} />
                            ) : (
                                <Text c="dimmed">{t('No data available')}</Text>
                            )}
                        </Card>
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
