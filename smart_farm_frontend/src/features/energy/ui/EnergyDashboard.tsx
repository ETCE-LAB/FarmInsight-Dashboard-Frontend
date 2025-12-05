import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Card,
    Grid,
    Group,
    Title,
    Text,
    Badge,
    Modal,
    Table,
    ActionIcon,
    Loader,
    Alert,
    RingProgress,
    ThemeIcon,
    Divider,
    Stack
} from '@mantine/core';
import {
    IconBolt,
    IconBattery,
    IconBatteryCharging,
    IconPlug,
    IconPlugOff,
    IconSun,
    IconWind,
    IconCirclePlus,
    IconEdit,
    IconAlertTriangle,
    IconCheck,
    IconX,
    IconRefresh
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';

import { useAppDispatch } from '../../../utils/Hooks';
import {
    selectEnergyConsumers,
    selectEnergySources,
    selectEnergyState,
    selectTotalConsumption,
    selectTotalProduction,
    selectNetPower,
    selectBatteryPercentage,
    selectEnergyLoading,
    selectEnergyError,
    setEnergyDashboard,
    setLoading,
    setError
} from '../state/EnergySlice';
import { EnergyConsumer, EnergySource, DEFAULT_ENERGY_THRESHOLDS } from '../models/Energy';
import { getEnergyDashboard } from '../useCase/getEnergyState';
import { EnergyConsumerForm } from './EnergyConsumerForm';
import { EnergySourceForm } from './EnergySourceForm';
import { EnergyConfigPanel } from './EnergyConfigPanel';
import { RootState } from '../../../utils/store';

const EnergyDashboard: React.FC = () => {
    const { fpfId } = useParams<{ fpfId: string }>();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // Redux State
    const consumers = useSelector(selectEnergyConsumers);
    const sources = useSelector(selectEnergySources);
    const energyState = useSelector(selectEnergyState);
    const totalConsumption = useSelector(selectTotalConsumption);
    const totalProduction = useSelector(selectTotalProduction);
    const netPower = useSelector(selectNetPower);
    const batteryPercentage = useSelector(selectBatteryPercentage);
    const isLoading = useSelector(selectEnergyLoading);
    const error = useSelector(selectEnergyError);
    const batteryLevelWh = useSelector((state: RootState) => state.energy.batteryLevelWh);

    // Local State
    const [consumerModalOpen, setConsumerModalOpen] = useState(false);
    const [sourceModalOpen, setSourceModalOpen] = useState(false);
    const [selectedConsumer, setSelectedConsumer] = useState<EnergyConsumer | undefined>(undefined);
    const [selectedSource, setSelectedSource] = useState<EnergySource | undefined>(undefined);

    // Threshold Settings (for config panel)
    const [gridConnectThreshold, setGridConnectThreshold] = useState(DEFAULT_ENERGY_THRESHOLDS.gridConnectPercent);
    const [shutdownThreshold, setShutdownThreshold] = useState(DEFAULT_ENERGY_THRESHOLDS.shutdownPercent);
    const [warningThreshold, setWarningThreshold] = useState(DEFAULT_ENERGY_THRESHOLDS.warningPercent);
    const [gridDisconnectThreshold, setGridDisconnectThreshold] = useState(DEFAULT_ENERGY_THRESHOLDS.gridDisconnectPercent);
    const [batteryMaxWh, setBatteryMaxWh] = useState(DEFAULT_ENERGY_THRESHOLDS.batteryMaxWh);

    // Load data
    const loadData = useCallback(async () => {
        if (!fpfId) return;

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const dashboardData = await getEnergyDashboard(fpfId, batteryLevelWh);
            dispatch(setEnergyDashboard(dashboardData));

            // Update thresholds from backend
            if (dashboardData.thresholds) {
                setGridConnectThreshold(dashboardData.thresholds.grid_connect_percent);
                setShutdownThreshold(dashboardData.thresholds.shutdown_percent);
                setWarningThreshold(dashboardData.thresholds.warning_percent);
                setGridDisconnectThreshold(dashboardData.thresholds.grid_disconnect_percent);
                setBatteryMaxWh(dashboardData.thresholds.battery_max_wh);
            }
        } catch (err: any) {
            dispatch(setError(err.message || t('common.loadErrorGeneric')));
            notifications.show({
                title: t('common.error'),
                message: err.message || t('common.loadErrorGeneric'),
                color: 'red'
            });
        } finally {
            dispatch(setLoading(false));
        }
    }, [fpfId, batteryLevelWh, dispatch, t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Handlers
    const handleAddConsumer = () => {
        setSelectedConsumer(undefined);
        setConsumerModalOpen(true);
    };

    const handleEditConsumer = (consumer: EnergyConsumer) => {
        setSelectedConsumer(consumer);
        setConsumerModalOpen(true);
    };

    const handleAddSource = () => {
        setSelectedSource(undefined);
        setSourceModalOpen(true);
    };

    const handleEditSource = (source: EnergySource) => {
        setSelectedSource(source);
        setSourceModalOpen(true);
    };

    // Helper functions
    const getStatusColor = (status?: string): string => {
        switch (status) {
            case 'normal': return 'green';
            case 'warning': return 'yellow';
            case 'critical': return 'red';
            default: return 'gray';
        }
    };

    const getActionIcon = (action?: string) => {
        switch (action) {
            case 'connect_grid': return <IconPlug size={16} />;
            case 'disconnect_grid': return <IconPlugOff size={16} />;
            case 'shutdown_non_critical': return <IconAlertTriangle size={16} />;
            case 'emergency_shutdown': return <IconX size={16} />;
            default: return <IconCheck size={16} />;
        }
    };

    const getSourceIcon = (sourceType: string) => {
        switch (sourceType) {
            case 'solar': return <IconSun size={20} />;
            case 'wind': return <IconWind size={20} />;
            case 'grid': return <IconPlug size={20} />;
            case 'battery': return <IconBattery size={20} />;
            default: return <IconBolt size={20} />;
        }
    };

    const getPriorityColor = (priority: number): string => {
        if (priority <= 3) return 'red';
        if (priority <= 6) return 'yellow';
        return 'green';
    };

    const getPriorityLabel = (priority: number): string => {
        if (priority <= 3) return t('energy.priorityCritical');
        if (priority <= 6) return t('energy.priorityMedium');
        return t('energy.priorityLow');
    };

    if (isLoading && !consumers.length && !sources.length) {
        return (
            <Box p="xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size="lg" />
            </Box>
        );
    }

    return (
        <Box p="md">
            {/* Header */}
            <Group justify="space-between" mb="lg">
                <Title order={2}>{t('energy.dashboardTitle')}</Title>
                <ActionIcon variant="light" onClick={loadData} loading={isLoading}>
                    <IconRefresh size={20} />
                </ActionIcon>
            </Group>

            {error && (
                <Alert color="red" mb="md" icon={<IconAlertTriangle />}>
                    {error}
                </Alert>
            )}

            {/* Status Overview Cards */}
            <Grid mb="lg">
                {/* Battery Status */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card shadow="sm" padding="lg" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>{t('energy.batteryLevel')}</Text>
                            <ThemeIcon
                                color={batteryPercentage > 20 ? 'green' : batteryPercentage > 10 ? 'yellow' : 'red'}
                                variant="light"
                            >
                                {netPower > 0 ? <IconBatteryCharging size={20} /> : <IconBattery size={20} />}
                            </ThemeIcon>
                        </Group>
                        <RingProgress
                            size={120}
                            thickness={12}
                            roundCaps
                            sections={[{ value: batteryPercentage, color: batteryPercentage > 20 ? 'green' : batteryPercentage > 10 ? 'yellow' : 'red' }]}
                            label={
                                <Text ta="center" fw={700} size="lg">
                                    {batteryPercentage.toFixed(1)}%
                                </Text>
                            }
                        />
                        <Text size="sm" c="dimmed" ta="center" mt="xs">
                            {batteryLevelWh.toFixed(0)} Wh / {batteryMaxWh} Wh
                        </Text>
                    </Card>
                </Grid.Col>

                {/* Power Balance */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card shadow="sm" padding="lg" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>{t('energy.powerBalance')}</Text>
                            <ThemeIcon color={netPower >= 0 ? 'green' : 'red'} variant="light">
                                <IconBolt size={20} />
                            </ThemeIcon>
                        </Group>
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="sm">{t('energy.production')}</Text>
                                <Text size="sm" c="green" fw={500}>+{totalProduction} W</Text>
                            </Group>
                            <Group justify="space-between">
                                <Text size="sm">{t('energy.consumption')}</Text>
                                <Text size="sm" c="red" fw={500}>-{totalConsumption} W</Text>
                            </Group>
                            <Divider />
                            <Group justify="space-between">
                                <Text size="sm" fw={500}>{t('energy.netPower')}</Text>
                                <Text size="sm" c={netPower >= 0 ? 'green' : 'red'} fw={700}>
                                    {netPower >= 0 ? '+' : ''}{netPower} W
                                </Text>
                            </Group>
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* Grid Status */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card shadow="sm" padding="lg" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>{t('energy.gridStatus')}</Text>
                            <ThemeIcon
                                color={energyState?.grid_connected ? 'green' : 'gray'}
                                variant="light"
                            >
                                {energyState?.grid_connected ? <IconPlug size={20} /> : <IconPlugOff size={20} />}
                            </ThemeIcon>
                        </Group>
                        <Badge
                            size="xl"
                            color={energyState?.grid_connected ? 'green' : 'gray'}
                            fullWidth
                        >
                            {energyState?.grid_connected ? t('energy.gridConnected') : t('energy.gridDisconnected')}
                        </Badge>
                        <Text size="sm" c="dimmed" mt="md">
                            {t('energy.gridConnectAt')}: {gridConnectThreshold}%
                        </Text>
                    </Card>
                </Grid.Col>

                {/* Current Action */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card shadow="sm" padding="lg" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text fw={500}>{t('energy.currentAction')}</Text>
                            <ThemeIcon color={getStatusColor(energyState?.status)} variant="light">
                                {getActionIcon(energyState?.action)}
                            </ThemeIcon>
                        </Group>
                        <Badge
                            size="lg"
                            color={getStatusColor(energyState?.status)}
                            fullWidth
                        >
                            {t(`energy.action.${energyState?.action || 'normal'}`)}
                        </Badge>
                        {energyState?.message && (
                            <Text size="sm" c="dimmed" mt="md">
                                {energyState.message}
                            </Text>
                        )}
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Energy Configuration Panel */}
            {fpfId && (
                <EnergyConfigPanel
                    fpfId={fpfId}
                    initialConfig={{
                        gridConnectThreshold,
                        shutdownThreshold,
                        warningThreshold,
                        batteryMaxWh,
                        gridDisconnectThreshold,
                    }}
                    onConfigUpdated={loadData}
                />
            )}

            {/* Energy Sources Section */}
            <Card shadow="sm" padding="lg" withBorder mb="lg">
                <Group justify="space-between" mb="md">
                    <Title order={3}>{t('energy.sources')}</Title>
                    <ActionIcon variant="light" color="blue" onClick={handleAddSource}>
                        <IconCirclePlus size={20} />
                    </ActionIcon>
                </Group>

                {sources.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">{t('energy.noSourcesFound')}</Text>
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t('energy.sourceType')}</Table.Th>
                                <Table.Th>{t('energy.sourceName')}</Table.Th>
                                <Table.Th>{t('energy.currentOutput')}</Table.Th>
                                <Table.Th>{t('energy.maxOutput')}</Table.Th>
                                <Table.Th>{t('energy.weatherDependent')}</Table.Th>
                                <Table.Th>{t('header.status')}</Table.Th>
                                <Table.Th>{t('header.actions')}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {sources.map((source) => (
                                <Table.Tr key={source.id}>
                                    <Table.Td>
                                        <Group gap="xs">
                                            {getSourceIcon(source.sourceType)}
                                            <Text>{t(`energy.source${source.sourceType.charAt(0).toUpperCase() + source.sourceType.slice(1)}`)}</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>{source.name}</Table.Td>
                                    <Table.Td>
                                        <Text c="green" fw={500}>{source.currentOutputWatts} W</Text>
                                    </Table.Td>
                                    <Table.Td>{source.maxOutputWatts} W</Table.Td>
                                    <Table.Td>
                                        <Badge color={source.weatherDependent ? 'blue' : 'gray'}>
                                            {source.weatherDependent ? t('common.activated') : t('common.inactive')}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={source.isActive ? 'green' : 'gray'}>
                                            {source.isActive ? t('common.activated') : t('common.inactive')}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon variant="subtle" onClick={() => handleEditSource(source)}>
                                            <IconEdit size={18} />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}
            </Card>

            {/* Energy Consumers Section */}
            <Card shadow="sm" padding="lg" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={3}>{t('energy.consumers')}</Title>
                    <ActionIcon variant="light" color="blue" onClick={handleAddConsumer}>
                        <IconCirclePlus size={20} />
                    </ActionIcon>
                </Group>

                {consumers.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">{t('energy.noConsumersFound')}</Text>
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t('energy.consumerName')}</Table.Th>
                                <Table.Th>{t('energy.consumptionWatts')}</Table.Th>
                                <Table.Th>{t('energy.priority')}</Table.Th>
                                <Table.Th>{t('energy.consumerShutdownThreshold')}</Table.Th>
                                <Table.Th>{t('energy.dependencies')}</Table.Th>
                                <Table.Th>{t('header.status')}</Table.Th>
                                <Table.Th>{t('header.actions')}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {consumers.map((consumer) => (
                                <Table.Tr key={consumer.id}>
                                    <Table.Td>{consumer.name}</Table.Td>
                                    <Table.Td>
                                        <Text c="red" fw={500}>{consumer.consumptionWatts} W</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={getPriorityColor(consumer.priority)}>
                                            {consumer.priority} - {getPriorityLabel(consumer.priority)}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={consumer.shutdownThreshold > 0 ? 'orange' : 'gray'} variant="light">
                                            {consumer.shutdownThreshold > 0 ? `${consumer.shutdownThreshold}%` : t('energy.shutdownNever')}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {consumer.dependencies && consumer.dependencies.length > 0 ? (
                                            <Group gap="xs">
                                                {consumer.dependencies.map((dep) => (
                                                    <Badge key={dep.id} variant="outline" size="sm">
                                                        {dep.name}
                                                    </Badge>
                                                ))}
                                            </Group>
                                        ) : (
                                            <Text c="dimmed" size="sm">{t('energy.noDependencies')}</Text>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={consumer.isActive ? 'green' : 'gray'}>
                                            {consumer.isActive ? t('common.activated') : t('common.inactive')}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon variant="subtle" onClick={() => handleEditConsumer(consumer)}>
                                            <IconEdit size={18} />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}
            </Card>

            {/* Consumer Modal */}
            <Modal
                opened={consumerModalOpen}
                onClose={() => setConsumerModalOpen(false)}
                title={selectedConsumer ? t('energy.editConsumer') : t('energy.addConsumer')}
                centered
                size="lg"
            >
                <EnergyConsumerForm
                    toEditConsumer={selectedConsumer}
                    onClose={() => {
                        setConsumerModalOpen(false);
                        loadData();
                    }}
                    existingConsumers={consumers}
                />
            </Modal>

            {/* Source Modal */}
            <Modal
                opened={sourceModalOpen}
                onClose={() => setSourceModalOpen(false)}
                title={selectedSource ? t('energy.editSource') : t('energy.addSource')}
                centered
                size="lg"
            >
                <EnergySourceForm
                    toEditSource={selectedSource}
                    onClose={() => {
                        setSourceModalOpen(false);
                        loadData();
                    }}
                />
            </Modal>
        </Box>
    );
};

export default EnergyDashboard;
