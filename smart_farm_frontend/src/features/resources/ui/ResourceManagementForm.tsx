import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Divider, Grid, Group, Stack, Switch, Text, TextInput, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconDroplet, IconDeviceFloppy } from '@tabler/icons-react';
import { Fpf } from '../../fpf/models/Fpf';
import { useDispatch } from 'react-redux';
import { updatedFpf } from '../../fpf/state/FpfSlice';
import { notifications } from '@mantine/notifications';
import { updateRmm } from '../../water/useCase/updateRmmSensors';

interface ResourceManagementFormProps {
    fpf: Fpf;
    onSuccess?: () => void;
}

export const ResourceManagementForm: React.FC<ResourceManagementFormProps> = ({ fpf, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Initialize state with current FPF values
    const [enabled, setEnabled] = useState(fpf.resourceManagementConfig?.rmmActive ?? false);
    const [waterSensorId, setWaterSensorId] = useState(fpf.resourceManagementConfig?.rmmSensorConfig?.waterSensorId || '');
    const [soilSensorId, setSoilSensorId] = useState(fpf.resourceManagementConfig?.rmmSensorConfig?.soilSensorId || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setEnabled(fpf.resourceManagementConfig?.rmmActive ?? false);
        setWaterSensorId(
            fpf.resourceManagementConfig?.rmmSensorConfig?.waterSensorId ?? ''
        );
        setSoilSensorId(
            fpf.resourceManagementConfig?.rmmSensorConfig?.soilSensorId ?? ''
        );
    }, [fpf]);

    const handleSave = async () => {
        setIsSubmitting(true);
        const id = notifications.show({
            loading: true,
            title: t('common.loading'),
            message: t('common.saving'),
            autoClose: false,
            withCloseButton: false,
        });

        const updatedData = {
            resourceManagementConfig:
            {
                rmmActive: enabled,
                rmmSensorConfig: {
                    waterSensorId: waterSensorId,
                    soilSensorId: soilSensorId,
                }
            }
        };

        try {
            const updated = await updateRmm(fpf.id, updatedData);
            const newFpf = {
                ...fpf,
                ...updated
            };
            dispatch(updatedFpf(newFpf));
            notifications.update({
                id,
                title: t('common.success'),
                message: t('common.saveSuccess'),
                color: 'green',
                loading: false,
                autoClose: 2000,
            });
            onSuccess?.();
        } catch (error) {
            notifications.update({
                id,
                title: t('common.error'),
                message: `${error}`,
                color: 'red',
                loading: false,
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const missingSensors = !waterSensorId || !soilSensorId;

    return (
        <Card padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">{t('resources.managementTitle')}</Title>

            <Stack gap="lg">
                <Box>
                    <Group justify="space-between" mb="xs">
                        <Group>
                            <IconDroplet size={24} color="#228be6" />
                            <div>
                                <Text fw={500}>{t('resources.waterResourceTitle')}</Text>
                                <Text size="sm" c="dimmed">
                                    {t('resources.waterResourceDesc')}
                                </Text>
                            </div>
                        </Group>
                        <Switch
                            checked={enabled}
                            onChange={(event) => setEnabled(event.currentTarget.checked)}
                            size="md"
                        />
                    </Group>

                    {enabled && (
                        <Box mt="md" pl={40}>
                            <Grid gutter="md">
                                <Grid.Col span={6}>
                                    <TextInput
                                        label={t('resources.waterSensorId')}
                                        placeholder={t('resources.waterSensorIdPlaceholder')}
                                        value={waterSensorId}
                                        onChange={(event) => setWaterSensorId(event.currentTarget.value)}
                                        description={t('resources.waterSensorIdDesc')}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label={t('resources.soilSensorId')}
                                        placeholder={t('resources.soilSensorIdPlaceholder')}
                                        value={soilSensorId}
                                        onChange={(event) => setSoilSensorId(event.currentTarget.value)}
                                        description={t('resources.soilSensorIdDesc')}
                                        required
                                    />
                                </Grid.Col>
                            </Grid>
                        </Box>
                    )}
                </Box>

                <Divider />

                <Group justify="flex-end">
                    <Button
                        leftSection={<IconDeviceFloppy size={18} />}
                        onClick={handleSave}
                        loading={isSubmitting}
                        disabled={enabled && (missingSensors)}
                    >
                        {t('common.saveButton')}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};
