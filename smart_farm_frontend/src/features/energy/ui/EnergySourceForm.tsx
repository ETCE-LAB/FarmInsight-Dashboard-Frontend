import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    NumberInput,
    Switch,
    TextInput,
    Select,
    Stack,
    Group,
    Paper,
    ThemeIcon,
    Text,
    Alert
} from "@mantine/core";
import { IconActivity, IconPlug, IconInfoCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../utils/Hooks";
import { 
    EnergySource, 
    CreateEnergySource,
    UpdateEnergySource,
    EnergySourceType 
} from "../models/Energy";
import { createEnergySource } from "../useCase/createEnergySource";
import { updateEnergySource, deleteEnergySource } from "../useCase/updateEnergySource";
import { addEnergySource, updateEnergySource as updateSourceState, removeEnergySource } from "../state/EnergySlice";
import { RootState } from "../../../utils/store";

interface EnergySourceFormProps {
    toEditSource?: EnergySource;
    onClose: () => void;
}

export const EnergySourceForm: React.FC<EnergySourceFormProps> = ({ 
    toEditSource, 
    onClose 
}) => {
    const { fpfId } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // Get sensors and actions from Redux state (fpf.fpf contains the current FPF data)
    const sensors = useSelector((state: RootState) => state.fpf.fpf?.Sensors || []);
    const actions = useSelector((state: RootState) => state.fpf.fpf?.ControllableAction || []);

    const [name, setName] = useState<string>("");
    const [sourceType, setSourceType] = useState<EnergySourceType>("solar");
    const [maxOutputWatts, setMaxOutputWatts] = useState<number>(0);
    const [currentOutputWatts, setCurrentOutputWatts] = useState<number>(0);
    const [weatherDependent, setWeatherDependent] = useState<boolean>(false);
    const [sensorId, setSensorId] = useState<string | null>(null);
    const [controllableActionId, setControllableActionId] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const sourceTypeOptions: { value: EnergySourceType; label: string }[] = [
        { value: 'solar', label: t('energy.sourceSolar') },
        { value: 'wind', label: t('energy.sourceWind') },
        { value: 'grid', label: t('energy.sourceGrid') },
        { value: 'battery', label: t('energy.sourceBattery') },
        { value: 'generator', label: t('energy.sourceGenerator') },
    ];

    // Sensor options - show all active sensors
    // Users can choose any sensor they want to link to this energy source
    const sensorOptions = sensors
        .filter((s: any) => s.isActive)
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

    useEffect(() => {
        if (toEditSource) {
            setName(toEditSource.name || "");
            setSourceType(toEditSource.sourceType || "solar");
            setMaxOutputWatts(toEditSource.maxOutputWatts || 0);
            setCurrentOutputWatts(toEditSource.currentOutputWatts || 0);
            setWeatherDependent(toEditSource.weatherDependent ?? false);
            setSensorId(toEditSource.sensorId || null);
            setControllableActionId(toEditSource.controllableActionId || null);
            setIsActive(toEditSource.isActive ?? true);
        }
    }, [toEditSource]);

    // Auto-set weather dependent based on source type
    useEffect(() => {
        if (sourceType === 'solar' || sourceType === 'wind') {
            setWeatherDependent(true);
        } else {
            setWeatherDependent(false);
        }
    }, [sourceType]);

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
            if (toEditSource) {
                const updateData: UpdateEnergySource = {
                    name,
                    sourceType,
                    maxOutputWatts,
                    currentOutputWatts,
                    weatherDependent,
                    sensorId,
                    controllableActionId,
                    isActive
                };

                const updated = await updateEnergySource(toEditSource.id, updateData);
                dispatch(updateSourceState(updated));

                notifications.show({
                    title: t('common.success'),
                    message: t('energy.sourceUpdated'),
                    color: 'green'
                });
            } else {
                if (!fpfId) return;

                const createData: CreateEnergySource = {
                    fpfId,
                    name,
                    sourceType,
                    maxOutputWatts,
                    currentOutputWatts,
                    weatherDependent,
                    sensorId,
                    controllableActionId,
                    isActive
                };

                const created = await createEnergySource(createData);
                dispatch(addEnergySource(created));

                notifications.show({
                    title: t('common.success'),
                    message: t('energy.sourceCreated'),
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
        if (!toEditSource) return;

        setIsSubmitting(true);

        try {
            await deleteEnergySource(toEditSource.id);
            dispatch(removeEnergySource(toEditSource.id));

            notifications.show({
                title: t('common.success'),
                message: t('energy.sourceDeleted'),
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
                    label={t('energy.sourceName')}
                    placeholder={t('energy.sourceNamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    required
                />

                <Select
                    label={t('energy.sourceType')}
                    value={sourceType}
                    onChange={(val) => setSourceType(val as EnergySourceType || 'solar')}
                    data={sourceTypeOptions}
                    required
                />

                <NumberInput
                    label={sourceType === 'battery' ? t('energy.batteryCapacitySource') : t('energy.maxOutputWatts')}
                    description={sourceType === 'battery' ? t('energy.batteryCapacitySourceDescription') : undefined}
                    placeholder="0"
                    value={maxOutputWatts}
                    onChange={(val) => setMaxOutputWatts(Number(val) || 0)}
                    min={0}
                    suffix={sourceType === 'battery' ? " Wh" : " W"}
                    required
                />

                {sourceType !== 'battery' && (
                    <NumberInput
                        label={t('energy.currentOutputWatts')}
                        description={sensorId
                            ? t('energy.outputLiveMeasured')
                            : t('energy.outputManualDescription')
                        }
                        placeholder={sensorId ? t('energy.measuredBySensor') : "0"}
                        value={currentOutputWatts}
                        onChange={(val) => setCurrentOutputWatts(Number(val) || 0)}
                        min={0}
                        max={maxOutputWatts}
                        suffix=" W"
                        disabled={!!sensorId}
                        styles={sensorId ? { input: { backgroundColor: 'var(--mantine-color-gray-1)', color: 'var(--mantine-color-dimmed)' } } : undefined}
                    />
                )}

                {/* Linked Sensor for Live Measurement */}
                <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-blue-6)' }}>
                    <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" color="blue" variant="light" radius="xl">
                            <IconActivity size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={600}>{t('energy.linkedSensor')}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mb="md">{t('energy.linkedSensorSourceDescription')}</Text>
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
                            {t('energy.sensorLinkedSourceInfo')}
                        </Alert>
                    )}
                </Paper>

                {/* Linked Action for Control (especially for grid) */}
                {(sourceType === 'grid' || sourceType === 'generator') && (
                    <Paper p="md" withBorder radius="md" style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}>
                        <Group gap="xs" mb="xs">
                            <ThemeIcon size="sm" color="green" variant="light" radius="xl">
                                <IconPlug size={14} />
                            </ThemeIcon>
                            <Text size="sm" fw={600}>{t('energy.linkedAction')}</Text>
                        </Group>
                        <Text size="xs" c="dimmed" mb="md">{t('energy.linkedActionSourceDescription')}</Text>
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
                                {t('energy.actionLinkedSourceInfo')}
                            </Alert>
                        )}
                    </Paper>
                )}

                <Switch
                    label={t('energy.weatherDependent')}
                    description={t('energy.weatherDependentDescription')}
                    checked={weatherDependent}
                    onChange={(e) => setWeatherDependent(e.currentTarget.checked)}
                />

                <Switch
                    label={t('energy.isActive')}
                    checked={isActive}
                    onChange={(e) => setIsActive(e.currentTarget.checked)}
                />

                <Group justify="space-between" mt="md">
                    {toEditSource && (
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
                            {toEditSource ? t('common.update') : t('common.create')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </Box>
    );
};

export default EnergySourceForm;
