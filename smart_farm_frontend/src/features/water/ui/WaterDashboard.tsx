import React, { useEffect, useState } from 'react';
import { Container, Title, SimpleGrid, Box, Grid, Card, Group, Text, ThemeIcon, ActionIcon, SegmentedControl, Center, Slider, Badge, Select, Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PredictionView } from '../../model/ui/PredictionView';
import { WaterTank } from './components/WaterTank';
import { WaterLevelChart } from './components/WaterLevelChart';
import { FieldMoistureMap } from './components/FieldMoistureMap';
import { AiInsightOrb } from './components/AiInsightOrb';
import { IconDroplet, IconActivity, IconTopologyStar3, IconRefresh, IconAlertTriangle, IconCheck, IconSun, IconCloudRain, IconCloud, IconThermometer, IconAlpha, IconEditCircle } from '@tabler/icons-react';
import { Fpf } from '../../fpf/models/Fpf';
import { getFpf } from '../../fpf/useCase/getFpf';
import { showNotification } from '@mantine/notifications';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../utils/store';
import { WeatherForecast } from '../../WeatherForecast/models/WeatherForecast';
import { getWeatherForecast } from '../../WeatherForecast/useCase/getWeatherForecast';
import { registerWeatherForecasts } from '../../WeatherForecast/state/WeatherForecastSlice';
import { waterResource } from '../../../core/resources';
import { registerWeatherAndWaterStatus } from '../state/WeatherAndWaterStatusSlice';
import { useAppDispatch } from '../../../utils/Hooks';
import { WeatherAndWaterStatus } from '../models/WeatherAndWaterStatus';

export const WaterDashboard = () => {
    const { t } = useTranslation();
    const { fpfId } = useParams<{ fpfId: string }>();

    const [fpf, setFpf] = useState<Fpf | null>(null);
    const params = useParams();

    const weatherAndWaterStatusSelector = useSelector((state: RootState) => state.weatherAndWaterStatus);

    const [weatherCode, setWeatherCode] = useState<string>('0'); // Default Clear
    const [temperature, setTemperature] = useState(22);
    const [weatherAndWaterStatus, setWeatherAndWaterStatus] = useState<WeatherAndWaterStatus | null>(null);

    // Derived state or defaults
    const waterLevel = weatherAndWaterStatus?.waterStatus?.waterLevel;
    const capacity = weatherAndWaterStatus?.waterStatus?.capacity;
    const avgUsage = weatherAndWaterStatus?.waterStatus?.avgUsage;
    const pumpStatus = weatherAndWaterStatus?.waterStatus?.pumpStatus ?? 'inactive';
    const pumpLastRun = weatherAndWaterStatus?.waterStatus?.pumpLastRun;

    const waterPercentage = capacity && waterLevel ? Math.round((waterLevel / capacity) * 100) : 0;

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
            if (weatherAndWaterStatusSelector.WeatherAndWaterStatus) {
                const cachedDataWrapper = weatherAndWaterStatusSelector.WeatherAndWaterStatus.find(obj => obj[fpf.Location.id]);
                if (cachedDataWrapper) {
                    const data = cachedDataWrapper[fpf.Location.id];
                    setTemperature(data.weatherStatus.currentTemperature);
                    setWeatherCode(data.weatherStatus.weatherCode);
                    setWeatherAndWaterStatus(data);
                    return;
                }
            }

            waterResource.getState(fpf.id, { locationId: fpf.Location.id }).then((resp) => {
                dispatch(registerWeatherAndWaterStatus({ [fpf.Location.id]: resp }));
                setTemperature(resp.weatherStatus.currentTemperature);
                setWeatherCode(resp.weatherStatus.weatherCode);
                setWeatherAndWaterStatus(resp);
                console.log("resp:", resp);
            }).catch((error) => {
                showNotification({
                    title: t("common.loadError"),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [fpf, t, dispatch, weatherAndWaterStatusSelector]);

    return (
        <Container fluid p="md" style={{ position: 'relative' }}>
            <Box style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000 }}>
                <AiInsightOrb rainProbability={weatherAndWaterStatus?.weatherStatus?.rainProbabilityToday || 0} />
            </Box>

            <Group justify="space-between" mb="lg">
                <Group>
                    <ThemeIcon size={32} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                        <IconDroplet size={20} />
                    </ThemeIcon>
                    <Title order={2}>{t('water.dashboardTitle')}</Title>
                </Group>

                <Group>
                    {/*
                    <ActionIcon variant="light" size="lg">
                        <IconRefresh size={20} />
                    </ActionIcon>
                    */}
                </Group>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
                {/*<StatusCard
                    title={t('water.currentLevel', 'Current Level')}
                    value={`${waterPercentage}%`}
                    subtext={`${waterLevel} Liters available`}
                    icon={<IconDroplet size={18} />}
                    color={getStatusColor(waterPercentage)}
                />*/}
                <StatusCard
                    title={t('water.systemStatus')}
                    value={weatherAndWaterStatus ? (waterPercentage < 20 ? t('water.statusCritical') : t('water.statusNormal')) : t('water.noData')}
                    icon={waterPercentage < 20 ? <IconAlertTriangle size={18} /> : <IconCheck size={18} />}
                    color={weatherAndWaterStatus ? (waterPercentage < 20 ? 'red' : 'green') : 'gray'}
                />
                {avgUsage && <StatusCard
                    title={t('water.dailyUsage')}
                    value={weatherAndWaterStatus ? `${avgUsage} L / day` : t('water.noData')}
                    icon={<IconActivity size={18} />}
                    color={weatherAndWaterStatus ? "blue" : "gray"}
                />}
                {pumpStatus && pumpLastRun && <StatusCard
                    title={t('water.pumpStatus')}
                    value={weatherAndWaterStatus ? (pumpStatus === 'thisWeekActive' ? t('water.pumpActive') : t('water.pumpInactive')) : t('water.noData')}
                    subtext={weatherAndWaterStatus ? `Last started: ${pumpLastRun}` : null}
                    icon={<IconTopologyStar3 size={18} />}
                    color={weatherAndWaterStatus ? (pumpStatus === 'thisWeekActive' ? 'green' : 'gray') : 'gray'}
                />}
            </SimpleGrid>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-md)' }}>
                        <Box style={{ flexGrow: 1, minHeight: 400 }}>
                            <WaterTank level={waterPercentage} capacity={capacity} weatherCode={parseInt(weatherCode)} temperature={temperature} />
                        </Box>
                    </Box>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-md)', height: '100%' }}>

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                            <WaterLevelChart data={weatherAndWaterStatus?.waterLevels} />
                            <FieldMoistureMap data={weatherAndWaterStatus?.fieldMoisture} />
                        </SimpleGrid>

                        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flexGrow: 1 }}>
                            <Title order={3} mb="lg" size="h4">{t('water.modelsTitle')}</Title>
                            {fpfId ? (
                                <PredictionView fpfId={fpfId} />
                            ) : (
                                <Text c="dimmed">{t('water.noData')}</Text>
                            )}
                        </Card>
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
