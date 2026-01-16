import React, { useState, useEffect } from 'react';
import {
    Card,
    Group,
    Title,
    Text,
    Button,
    NumberInput,
    Slider,
    Divider,
    ThemeIcon,
    Badge,
    Paper,
    Grid,
    Collapse,
    ActionIcon,
    Box
} from '@mantine/core';
import {
    IconSettings,
    IconBattery,
    IconBatteryCharging,
    IconPlug,
    IconPlugOff,
    IconAlertTriangle,
    IconCheck,
    IconChevronDown,
    IconChevronUp,
    IconDeviceFloppy,
    IconRefresh,
    IconPower
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { updateEnergyConfig } from '../useCase/updateEnergyConfig';

interface EnergyConfigPanelProps {
    fpfId: string;
    initialConfig?: {
        gridConnectThreshold: number;
        shutdownThreshold: number;
        warningThreshold: number;
        batteryMaxWh: number;
        gridDisconnectThreshold: number;
    };
    onConfigUpdated?: () => void;
}

export const EnergyConfigPanel: React.FC<EnergyConfigPanelProps> = ({
    fpfId,
    initialConfig,
    onConfigUpdated
}) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Config state
    const [gridConnectThreshold, setGridConnectThreshold] = useState(initialConfig?.gridConnectThreshold || 11);
    const [shutdownThreshold, setShutdownThreshold] = useState(initialConfig?.shutdownThreshold || 10);
    const [warningThreshold, setWarningThreshold] = useState(initialConfig?.warningThreshold || 20);
    const [batteryMaxWh, setBatteryMaxWh] = useState(initialConfig?.batteryMaxWh || 1600);
    const [gridDisconnectThreshold, setGridDisconnectThreshold] = useState(initialConfig?.gridDisconnectThreshold || 50);

    // Original values for comparison
    const [originalConfig, setOriginalConfig] = useState(initialConfig);

    useEffect(() => {
        if (initialConfig) {
            setGridConnectThreshold(initialConfig.gridConnectThreshold);
            setShutdownThreshold(initialConfig.shutdownThreshold);
            setWarningThreshold(initialConfig.warningThreshold);
            setBatteryMaxWh(initialConfig.batteryMaxWh);
            setGridDisconnectThreshold(initialConfig.gridDisconnectThreshold);
            setOriginalConfig(initialConfig);
        }
    }, [initialConfig]);

    // Check for changes
    useEffect(() => {
        if (originalConfig) {
            const changed =
                gridConnectThreshold !== originalConfig.gridConnectThreshold ||
                shutdownThreshold !== originalConfig.shutdownThreshold ||
                warningThreshold !== originalConfig.warningThreshold ||
                batteryMaxWh !== originalConfig.batteryMaxWh ||
                gridDisconnectThreshold !== originalConfig.gridDisconnectThreshold;
            setHasChanges(changed);
        }
    }, [gridConnectThreshold, shutdownThreshold, warningThreshold, batteryMaxWh, gridDisconnectThreshold, originalConfig]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateEnergyConfig(fpfId, {
                energyGridConnectThreshold: gridConnectThreshold,
                energyShutdownThreshold: shutdownThreshold,
                energyWarningThreshold: warningThreshold,
                energyBatteryMaxWh: batteryMaxWh,
                energyGridDisconnectThreshold: gridDisconnectThreshold,
            });

            setOriginalConfig({
                gridConnectThreshold,
                shutdownThreshold,
                warningThreshold,
                batteryMaxWh,
                gridDisconnectThreshold,
            });

            notifications.show({
                title: t('common.success'),
                message: t('energy.configSaved'),
                color: 'green',
                icon: <IconCheck size={16} />
            });

            onConfigUpdated?.();
        } catch (error: any) {
            notifications.show({
                title: t('common.error'),
                message: error.message || t('common.saveError'),
                color: 'red',
                icon: <IconAlertTriangle size={16} />
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (originalConfig) {
            setGridConnectThreshold(originalConfig.gridConnectThreshold);
            setShutdownThreshold(originalConfig.shutdownThreshold);
            setWarningThreshold(originalConfig.warningThreshold);
            setBatteryMaxWh(originalConfig.batteryMaxWh);
            setGridDisconnectThreshold(originalConfig.gridDisconnectThreshold);
        }
    };

    // Visual battery preview component
    const BatteryPreview = () => {
        const zones = [
            { start: 0, end: shutdownThreshold, color: 'red', label: t('energy.zoneShutdown') },
            { start: shutdownThreshold, end: gridConnectThreshold, color: 'orange', label: t('energy.zoneGridConnect') },
            { start: gridConnectThreshold, end: warningThreshold, color: 'yellow', label: t('energy.zoneWarning') },
            { start: warningThreshold, end: gridDisconnectThreshold, color: 'lime', label: t('energy.zoneNormal') },
            { start: gridDisconnectThreshold, end: 100, color: 'green', label: t('energy.zoneOptimal') },
        ];

        return (
            <Paper p="md" withBorder radius="md" bg="dark.7">
                <Text size="sm" fw={500} mb="sm" c="dimmed">{t('energy.thresholdPreview')}</Text>
                <Box style={{ position: 'relative', height: 40, borderRadius: 8, overflow: 'hidden', background: '#1a1a1a' }}>
                    {zones.map((zone, idx) => (
                        <Box
                            key={idx}
                            style={{
                                position: 'absolute',
                                left: `${zone.start}%`,
                                width: `${zone.end - zone.start}%`,
                                height: '100%',
                                background: `var(--mantine-color-${zone.color}-6)`,
                                opacity: 0.7,
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                    {/* Threshold markers */}
                    <Box style={{ position: 'absolute', left: `${shutdownThreshold}%`, height: '100%', width: 2, background: 'white', zIndex: 10 }} />
                    <Box style={{ position: 'absolute', left: `${gridConnectThreshold}%`, height: '100%', width: 2, background: 'white', zIndex: 10 }} />
                    <Box style={{ position: 'absolute', left: `${warningThreshold}%`, height: '100%', width: 2, background: 'white', zIndex: 10 }} />
                    <Box style={{ position: 'absolute', left: `${gridDisconnectThreshold}%`, height: '100%', width: 2, background: 'white', zIndex: 10 }} />
                </Box>
                <Group justify="space-between" mt="xs">
                    <Text size="xs" c="dimmed">0%</Text>
                    <Text size="xs" c="dimmed">50%</Text>
                    <Text size="xs" c="dimmed">100%</Text>
                </Group>
                <Group gap="xs" mt="md" wrap="wrap">
                    {zones.map((zone, idx) => (
                        <Badge key={idx} size="xs" color={zone.color} variant="light">
                            {zone.label}
                        </Badge>
                    ))}
                </Group>
            </Paper>
        );
    };

    return (
        <Card shadow="sm" padding="lg" withBorder radius="md" mb="lg">
            {/* Header */}
            <Group justify="space-between" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
                <Group>
                    <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }}>
                        <IconSettings size={20} />
                    </ThemeIcon>
                    <div>
                        <Title order={4}>{t('energy.configurationTitle')}</Title>
                        <Text size="sm" c="dimmed">{t('energy.configurationSubtitle')}</Text>
                    </div>
                </Group>
                <Group>
                    {hasChanges && (
                        <Badge color="orange" variant="light">
                            {t('energy.unsavedChanges')}
                        </Badge>
                    )}
                    <ActionIcon variant="subtle" size="lg">
                        {isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                    </ActionIcon>
                </Group>
            </Group>

            <Collapse in={isExpanded}>
                <Divider my="md" />

                {/* Battery Capacity */}
                <Paper p="md" withBorder radius="md" mb="md">
                    <Group mb="md">
                        <ThemeIcon size="md" color="blue" variant="light">
                            <IconBattery size={16} />
                        </ThemeIcon>
                        <Text fw={500}>{t('energy.batteryCapacity')}</Text>
                    </Group>
                    <NumberInput
                        label={t('energy.maxBatteryCapacity')}
                        description={t('energy.maxBatteryCapacityDescription')}
                        value={batteryMaxWh}
                        onChange={(val) => setBatteryMaxWh(Number(val) || 1600)}
                        min={100}
                        max={100000}
                        step={100}
                        suffix=" Wh"
                        size="sm"
                        leftSection={<IconBatteryCharging size={16} />}
                    />
                    <Text size="xs" c="dimmed" mt="xs">
                        = {(batteryMaxWh / 1000).toFixed(2)} kWh
                    </Text>
                </Paper>

                {/* Threshold Configuration */}
                <Paper p="md" withBorder radius="md" mb="md">
                    <Group mb="lg">
                        <ThemeIcon size="md" color="yellow" variant="light">
                            <IconAlertTriangle size={16} />
                        </ThemeIcon>
                        <Text fw={500}>{t('energy.thresholdSettings')}</Text>
                    </Group>

                    <Grid gutter="md">
                        {/* Shutdown Threshold */}
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-red-6)' }}>
                                <Group gap="xs" mb="sm">
                                    <ThemeIcon size="sm" color="red" variant="light" radius="xl">
                                        <IconPower size={14} />
                                    </ThemeIcon>
                                    <Text size="sm" fw={600}>{t('energy.shutdownThreshold')}</Text>
                                </Group>
                                <Text size="xs" c="dimmed" mb="md">{t('energy.shutdownThresholdDescription')}</Text>
                                <Slider
                                    value={shutdownThreshold}
                                    onChange={setShutdownThreshold}
                                    min={1}
                                    max={gridConnectThreshold - 1}
                                    step={1}
                                    color="red"
                                    mb="md"
                                    label={(val) => `${val}%`}
                                />
                                <NumberInput
                                    value={shutdownThreshold}
                                    onChange={(val) => setShutdownThreshold(Number(val) || 10)}
                                    min={1}
                                    max={gridConnectThreshold - 1}
                                    suffix=" %"
                                    size="sm"
                                />
                            </Paper>
                        </Grid.Col>

                        {/* Grid Connect Threshold */}
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-orange-6)' }}>
                                <Group gap="xs" mb="sm">
                                    <ThemeIcon size="sm" color="orange" variant="light" radius="xl">
                                        <IconPlug size={14} />
                                    </ThemeIcon>
                                    <Text size="sm" fw={600}>{t('energy.gridConnectThreshold')}</Text>
                                </Group>
                                <Text size="xs" c="dimmed" mb="md">{t('energy.gridConnectThresholdDescription')}</Text>
                                <Slider
                                    value={gridConnectThreshold}
                                    onChange={setGridConnectThreshold}
                                    min={shutdownThreshold + 1}
                                    max={warningThreshold - 1}
                                    step={1}
                                    color="orange"
                                    mb="md"
                                    label={(val) => `${val}%`}
                                />
                                <NumberInput
                                    value={gridConnectThreshold}
                                    onChange={(val) => setGridConnectThreshold(Number(val) || 11)}
                                    min={shutdownThreshold + 1}
                                    max={warningThreshold - 1}
                                    suffix=" %"
                                    size="sm"
                                />
                            </Paper>
                        </Grid.Col>

                        {/* Warning Threshold */}
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-yellow-6)' }}>
                                <Group gap="xs" mb="sm">
                                    <ThemeIcon size="sm" color="yellow" variant="light" radius="xl">
                                        <IconAlertTriangle size={14} />
                                    </ThemeIcon>
                                    <Text size="sm" fw={600}>{t('energy.warningThreshold')}</Text>
                                </Group>
                                <Text size="xs" c="dimmed" mb="md">{t('energy.warningThresholdDescription')}</Text>
                                <Slider
                                    value={warningThreshold}
                                    onChange={setWarningThreshold}
                                    min={gridConnectThreshold + 1}
                                    max={gridDisconnectThreshold - 1}
                                    step={1}
                                    color="yellow"
                                    mb="md"
                                    label={(val) => `${val}%`}
                                />
                                <NumberInput
                                    value={warningThreshold}
                                    onChange={(val) => setWarningThreshold(Number(val) || 20)}
                                    min={gridConnectThreshold + 1}
                                    max={gridDisconnectThreshold - 1}
                                    suffix=" %"
                                    size="sm"
                                />
                            </Paper>
                        </Grid.Col>

                        {/* Grid Disconnect Threshold */}
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}>
                                <Group gap="xs" mb="sm">
                                    <ThemeIcon size="sm" color="green" variant="light" radius="xl">
                                        <IconPlugOff size={14} />
                                    </ThemeIcon>
                                    <Text size="sm" fw={600}>{t('energy.gridDisconnectThreshold')}</Text>
                                </Group>
                                <Text size="xs" c="dimmed" mb="md">{t('energy.gridDisconnectThresholdDescription')}</Text>
                                <Slider
                                    value={gridDisconnectThreshold}
                                    onChange={setGridDisconnectThreshold}
                                    min={warningThreshold + 1}
                                    max={99}
                                    step={1}
                                    color="green"
                                    mb="md"
                                    label={(val) => `${val}%`}
                                />
                                <NumberInput
                                    value={gridDisconnectThreshold}
                                    onChange={(val) => setGridDisconnectThreshold(Number(val) || 50)}
                                    min={warningThreshold + 1}
                                    max={99}
                                    suffix=" %"
                                    size="sm"
                                />
                            </Paper>
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* Visual Preview */}
                <BatteryPreview />

                {/* Action Buttons */}
                <Group justify="flex-end" mt="lg">
                    <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<IconRefresh size={16} />}
                        onClick={handleReset}
                        disabled={!hasChanges}
                    >
                        {t('energy.resetChanges')}
                    </Button>
                    <Button
                        variant="gradient"
                        gradient={{ from: 'orange', to: 'yellow' }}
                        leftSection={<IconDeviceFloppy size={16} />}
                        onClick={handleSave}
                        loading={isSaving}
                        disabled={!hasChanges}
                    >
                        {t('energy.saveConfiguration')}
                    </Button>
                </Group>
            </Collapse>
        </Card>
    );
};

export default EnergyConfigPanel;

