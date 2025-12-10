import React, { useEffect, useState } from 'react';
import { Container, Title, SimpleGrid, Box, Grid, Card, Group, Text, ThemeIcon, ActionIcon, SegmentedControl, Center, Slider, Badge, Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PredictionView } from '../../model/ui/PredictionView';
import { WaterTank } from './components/WaterTank';
import { PipeDistribution } from './components/PipeDistribution';
import { WaterUsageChart } from './components/WaterUsageChart';
import { FieldMoistureMap } from './components/FieldMoistureMap';
import { AiInsightOrb } from './components/AiInsightOrb';
import { IconDroplet, IconActivity, IconTopologyStar3, IconRefresh, IconAlertTriangle, IconCheck, IconSun, IconCloudRain, IconCloud, IconThermometer } from '@tabler/icons-react';
import { Fpf } from '../../fpf/models/Fpf';
import { getFpf } from '../../fpf/useCase/getFpf';
import { showNotification } from '@mantine/notifications';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../utils/store';
import { WeatherForecast } from '../../WeatherForecast/models/WeatherForecast';
import { getWeatherForecast } from '../../WeatherForecast/useCase/getWeatherForecast';
import { registerWeatherForecasts } from '../../WeatherForecast/state/WeatherForecastSlice';
import { getWeatherAndTankStatus } from '../useCase/getWeatherAndTankStatus';
import { registerWeatherAndTankStatus } from '../state/WeatherAndTankStatusSlice';
import { useAppDispatch } from '../../../utils/Hooks';

export const WaterDashboard = () => {
    const { t } = useTranslation();
    const { fpfId } = useParams<{ fpfId: string }>();

    const [fpf, setFpf] = useState<Fpf | null>(null);
    const params = useParams();

    const weatherAndTankStatusSelector = useSelector((state: RootState) => state.weatherAndTankStatus);
    const [weatherForecasts, setWeatherForecasts] = useState<WeatherForecast[]>([]);

    const [waterLevel] = useState(70);
    const [capacity] = useState(210);
    const [dailyUsage] = useState(5);
    const [pumpStatus] = useState<'active' | 'inactive' | 'error'>('active');

    const [weatherCode, setWeatherCode] = useState<string>('0'); // Default Clear
    const [temperature, setTemperature] = useState(22);

    const WEATHER_CODES = [
        { value: '0', label: 'Clear Sky' },
        { value: '1', label: 'Mainly Clear' },
        { value: '2', label: 'Partly Cloudy' },
        { value: '3', label: 'Overcast' },
        { value: '45', label: 'Fog' },
        { value: '48', label: 'Depositing Rime Fog' },
        { value: '51', label: 'Light Drizzle' },
        { value: '53', label: 'Moderate Drizzle' },
        { value: '55', label: 'Dense Drizzle' },
        { value: '56', label: 'Light Freezing Drizzle' },
        { value: '57', label: 'Dense Freezing Drizzle' },
        { value: '61', label: 'Slight Rain' },
        { value: '63', label: 'Moderate Rain' },
        { value: '65', label: 'Heavy Rain' },
        { value: '66', label: 'Light Freezing Rain' },
        { value: '67', label: 'Heavy Freezing Rain' },
        { value: '71', label: 'Slight Snow Fall' },
        { value: '73', label: 'Moderate Snow Fall' },
        { value: '75', label: 'Heavy Snow Fall' },
        { value: '77', label: 'Snow Grains' },
        { value: '80', label: 'Slight Rain Showers' },
        { value: '81', label: 'Moderate Rain Showers' },
        { value: '82', label: 'Violent Rain Showers' },
        { value: '85', label: 'Slight Snow Showers' },
        { value: '86', label: 'Heavy Snow Showers' },
        { value: '95', label: 'Thunderstorm' },
        { value: '96', label: 'Thunderstorm with slight hail' },
        { value: '99', label: 'Thunderstorm with heavy hail' },
    ];

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

    useEffect(() => {
        if (params?.fpfId) {
            getFpf(params.fpfId).then(resp => {
                setFpf(resp);

            }).catch((error) => {
                showNotification({
                    title: t('common.loadingError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    }, [params, t]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (fpf?.Location) {
            if (weatherAndTankStatusSelector.WeatherAndTankStatus) {
                const cachedDataWrapper = weatherAndTankStatusSelector.WeatherAndTankStatus.find(obj => obj[fpf.Location.id]);
                if (cachedDataWrapper) {
                    const data = cachedDataWrapper[fpf.Location.id];
                    setTemperature(data.weather.currentTemperature);
                    setWeatherCode(data.weather.weatherCode);
                    return;
                }
            }

            if (fpf.Sensors && fpf.Sensors.length > 3) {
                getWeatherAndTankStatus(fpf.Location.id, fpf.Sensors[3].id).then((resp) => {
                    dispatch(registerWeatherAndTankStatus({ [fpf.Location.id]: resp }));
                    setTemperature(resp.weather.currentTemperature);
                    setWeatherCode(resp.weather.weatherCode);
                }).catch((error) => {
                    showNotification({
                        title: t("common.loadError"),
                        message: `${error}`,
                        color: 'red',
                    });
                });
            }
        }
    }, [fpf, t, dispatch, weatherAndTankStatusSelector]);

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
                        {<Slider
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
                        />}
                    </Box>

                    {/* Weather Controls (Demo) */}
                    <Select
                        value={weatherCode}
                        onChange={(value) => setWeatherCode(value || '0')}
                        data={WEATHER_CODES}
                        allowDeselect={false}
                        w={250}
                        leftSection={<IconCloud size={16} />}
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
                    subtext="Average: 5 L / day"
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
                            <WaterTank level={waterLevel} capacity={capacity} weatherCode={parseInt(weatherCode)} temperature={temperature} />
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
