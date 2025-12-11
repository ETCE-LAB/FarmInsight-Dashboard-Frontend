import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    NumberInput,
    Switch,
    TextInput,
    Select,
    MultiSelect,
    Stack,
    Group,
    Slider,
    Text,
    Paper,
    ThemeIcon,
    Alert
} from "@mantine/core";
import { IconBolt, IconPlug, IconActivity, IconInfoCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../utils/Hooks";
import { 
    EnergyConsumer, 
    CreateEnergyConsumer, 
    UpdateEnergyConsumer 
} from "../models/Energy";
import { createEnergyConsumer } from "../useCase/createEnergyConsumer";
import { updateEnergyConsumer, deleteEnergyConsumer } from "../useCase/updateEnergyConsumer";
import { addEnergyConsumer, updateEnergyConsumer as updateConsumerState, removeEnergyConsumer } from "../state/EnergySlice";
import { RootState } from "../../../utils/store";

interface EnergyConsumerFormProps {
    toEditConsumer?: EnergyConsumer;
    onClose: () => void;
    existingConsumers?: EnergyConsumer[];
}

export const EnergyConsumerForm: React.FC<EnergyConsumerFormProps> = ({ 
    toEditConsumer, 
    onClose,
    existingConsumers = []
}) => {
    const { fpfId } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // Get sensors and actions from Redux state (fpf.fpf contains the current FPF data)
    const sensors = useSelector((state: RootState) => state.fpf.fpf?.Sensors || []);
    const actions = useSelector((state: RootState) => state.fpf.fpf?.ControllableAction || []);

    const [name, setName] = useState<string>("");
    const [consumptionWatts, setConsumptionWatts] = useState<number>(0);
    const [priority, setPriority] = useState<number>(5);
    const [shutdownThreshold, setShutdownThreshold] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [dependencyIds, setDependencyIds] = useState<string[]>([]);
    const [sensorId, setSensorId] = useState<string | null>(null);
    const [controllableActionId, setControllableActionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (toEditConsumer) {
            setName(toEditConsumer.name || "");
            setConsumptionWatts(toEditConsumer.consumptionWatts || 0);
            setPriority(toEditConsumer.priority || 5);
            setShutdownThreshold(toEditConsumer.shutdownThreshold || 0);
            setIsActive(toEditConsumer.isActive ?? true);
            setDependencyIds(toEditConsumer.dependencyIds || []);
            setSensorId(toEditConsumer.sensorId || null);
            setControllableActionId(toEditConsumer.controllableActionId || null);
        }
    }, [toEditConsumer]);

    const priorityOptions = Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1} - ${i < 3 ? t('energy.priorityCritical') : i < 6 ? t('energy.priorityMedium') : t('energy.priorityLow')}`
    }));

    const dependencyOptions = existingConsumers
        .filter(c => c.id !== toEditConsumer?.id)
        .map(c => ({
            value: c.id,
            label: `${c.name} (${c.consumptionWatts}W)`
        }));

    // Sensor options - filter for power-related sensors (unit W or parameter containing watt)
    const sensorOptions = sensors
        .filter((s: any) => s.isActive)
        .filter((s: any) => {
            const unit = (s.unit || '').toLowerCase();
            const parameter = (s.parameter || '').toLowerCase();
            // Show sensors that measure power (W) - for consumption measurement
            return unit === 'w' || parameter.includes('watt');
        })
        .map((s: any) => ({
            value: s.id,
            label: `${s.name} (${s.unit || s.parameter || 'N/A'})`
        }));

    // Action options - filter for active actions
    const actionOptions = actions
        .filter((a: any) => a.isActive)
        .map((a: any) => ({
            value: a.id,
            label: `${a.name}${a.actionScriptName ? ` - ${a.actionScriptName}` : ''}`
        }));

    const handleSubmit = async () => {
        if (!name.trim()) {
            notifications.show({
                title: t('common.error'),
                message: t('energy.nameRequired'),
                color: 'red'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            if (toEditConsumer) {
                const updateData: UpdateEnergyConsumer = {
                    name,
                    consumptionWatts,
                    priority,
                    shutdownThreshold,
                    isActive,
                    dependencyIds,
                    sensorId,
                    controllableActionId
                };

                const updated = await updateEnergyConsumer(toEditConsumer.id, updateData);
                dispatch(updateConsumerState(updated));

                notifications.show({
                    title: t('common.success'),
                    message: t('energy.consumerUpdated'),
                    color: 'green'
                });
            } else {
                if (!fpfId) return;

                const createData: CreateEnergyConsumer = {
                    fpfId,
                    name,
                    consumptionWatts,
                    priority,
                    shutdownThreshold,
                    isActive,
                    dependencyIds,
                    sensorId,
                    controllableActionId
                };

                const created = await createEnergyConsumer(createData);
                dispatch(addEnergyConsumer(created));

                notifications.show({
                    title: t('common.success'),
                    message: t('energy.consumerCreated'),
                    color: 'green'
                });
            }

            onClose();
        } catch (error: any) {
            notifications.show({
                title: t('common.error'),
                message: error.message || t('common.unknownError'),
                color: 'red'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!toEditConsumer) return;

        setIsSubmitting(true);

        try {
            await deleteEnergyConsumer(toEditConsumer.id);
            dispatch(removeEnergyConsumer(toEditConsumer.id));

            notifications.show({
                title: t('common.success'),
                message: t('energy.consumerDeleted'),
                color: 'green'
            });

            onClose();
        } catch (error: any) {
            notifications.show({
                title: t('common.error'),
                message: error.message || t('common.unknownError'),
                color: 'red'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box p="md">
            <Stack gap="md">
                <TextInput
                    label={t('energy.consumerName')}
                    placeholder={t('energy.consumerNamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    required
                />

                <NumberInput
                    label={t('energy.consumptionWatts')}
                    description={sensorId
                        ? t('energy.consumptionLiveMeasured')
                        : t('energy.consumptionManualDescription')
                    }
                    placeholder={sensorId ? t('energy.measuredBySensor') : "0"}
                    value={consumptionWatts}
                    onChange={(val) => setConsumptionWatts(Number(val) || 0)}
                    min={0}
                    suffix=" W"
                    required={!sensorId}
                    disabled={!!sensorId}
                    styles={sensorId ? { input: { backgroundColor: 'var(--mantine-color-gray-1)', color: 'var(--mantine-color-dimmed)' } } : undefined}
                />

                <Select
                    label={t('energy.priority')}
                    description={t('energy.priorityDescription')}
                    value={String(priority)}
                    onChange={(val) => setPriority(Number(val) || 5)}
                    data={priorityOptions}
                />

                {/* Linked Sensor for Live Measurement */}
                <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-blue-6)' }}>
                    <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" color="blue" variant="light" radius="xl">
                            <IconActivity size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={600}>{t('energy.linkedSensor')}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mb="md">{t('energy.linkedSensorDescription')}</Text>
                    <Select
                        placeholder={t('energy.selectSensor')}
                        value={sensorId}
                        onChange={setSensorId}
                        data={sensorOptions}
                        clearable
                        searchable
                    />
                    {sensorId && (
                        <Alert icon={<IconInfoCircle size={16} />} color="blue" mt="xs" variant="light">
                            {t('energy.sensorLinkedInfo')}
                        </Alert>
                    )}
                </Paper>

                {/* Linked Action for Automatic Control */}
                <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}>
                    <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" color="green" variant="light" radius="xl">
                            <IconPlug size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={600}>{t('energy.linkedAction')}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mb="md">{t('energy.linkedActionDescription')}</Text>
                    <Select
                        placeholder={t('energy.selectAction')}
                        value={controllableActionId}
                        onChange={setControllableActionId}
                        data={actionOptions}
                        clearable
                        searchable
                    />
                    {controllableActionId && (
                        <Alert icon={<IconInfoCircle size={16} />} color="green" mt="xs" variant="light">
                            {t('energy.actionLinkedInfo')}
                        </Alert>
                    )}
                </Paper>

                {/* Shutdown Threshold */}
                <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-orange-6)' }}>
                    <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" color="orange" variant="light" radius="xl">
                            <IconBolt size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={600}>{t('energy.consumerShutdownThreshold')}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mb="md">{t('energy.consumerShutdownThresholdDescription')}</Text>
                    <Slider
                        value={shutdownThreshold}
                        onChange={setShutdownThreshold}
                        min={0}
                        max={100}
                        step={5}
                        marks={[
                            { value: 0, label: t('energy.shutdownNever') },
                            { value: 25, label: '25%' },
                            { value: 50, label: '50%' },
                            { value: 75, label: '75%' },
                        ]}
                        color={shutdownThreshold === 0 ? 'gray' : 'orange'}
                        mb="xl"
                        label={(val) => val === 0 ? t('energy.shutdownNever') : `${val}%`}
                    />
                    <NumberInput
                        value={shutdownThreshold}
                        onChange={(val) => setShutdownThreshold(Number(val) || 0)}
                        min={0}
                        max={100}
                        suffix=" %"
                        size="sm"
                        description={shutdownThreshold === 0 ? t('energy.shutdownUseGlobal') : t('energy.shutdownAtPercent', { percent: shutdownThreshold })}
                    />
                </Paper>

                {dependencyOptions.length > 0 && (
                    <MultiSelect
                        label={t('energy.dependencies')}
                        description={t('energy.dependenciesDescription')}
                        placeholder={t('energy.selectDependencies')}
                        value={dependencyIds}
                        onChange={setDependencyIds}
                        data={dependencyOptions}
                        searchable
                        clearable
                    />
                )}

                <Switch
                    label={t('energy.isActive')}
                    checked={isActive}
                    onChange={(e) => setIsActive(e.currentTarget.checked)}
                />

                <Group justify="space-between" mt="md">
                    {toEditConsumer && (
                        <Button
                            color="red"
                            variant="outline"
                            onClick={handleDelete}
                            loading={isSubmitting}
                        >
                            {t('common.delete')}
                        </Button>
                    )}
                    <Group>
                        <Button variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={handleSubmit} loading={isSubmitting}>
                            {toEditConsumer ? t('common.update') : t('common.create')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </Box>
    );
};

export default EnergyConsumerForm;
