import React, { useEffect, useState } from 'react';
import { Card, Container, SimpleGrid, Text, ThemeIcon, Title, UnstyledButton, Group } from '@mantine/core';
import { IconDroplet, IconBolt } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '../../../utils/appRoutes';
import { getFpf } from '../../fpf/useCase/getFpf';
import { Fpf } from '../../fpf/models/Fpf';
import { showNotification } from '@mantine/notifications';

export const ResourceHub = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { organizationId, fpfId } = useParams();
    const [fpf, setFpf] = useState<Fpf | null>(null);

    useEffect(() => {
        if (fpfId) {
            getFpf(fpfId).then((resp) => {
                setFpf(resp);
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    }, [fpfId, t]);

    const navigateTo = (path: string) => {
        if (!organizationId || !fpfId) return;
        const url = path
            .replace(':organizationId', organizationId)
            .replace(':fpfId', fpfId);
        navigate(url);
    };

    const hasWaterMonitoring = fpf && fpf.resourceManagementConfig.rmmActive;

    return (
        <Container size="lg" py="xl">
            <Title order={2} mb="xl">{t('resources.hubTitle', 'Resource Management')}</Title>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {hasWaterMonitoring && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <UnstyledButton onClick={() => navigateTo(AppRoutes.waterDashboard)} style={{ width: '100%' }}>
                            <Group>
                                <ThemeIcon size={40} radius="md" variant="light" color="blue">
                                    <IconDroplet size={24} />
                                </ThemeIcon>
                                <div style={{ flex: 1 }}>
                                    <Text size="lg" fw={500}>{t('resources.waterTitle', 'Water Management')}</Text>
                                    <Text size="sm" c="dimmed">
                                        {t('resources.waterDesc', 'Monitor water levels, usage, and predictions.')}
                                    </Text>
                                </div>
                            </Group>
                        </UnstyledButton>
                    </Card>
                )}

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <UnstyledButton onClick={() => navigateTo(AppRoutes.energyDashboard)} style={{ width: '100%' }}>
                        <Group>
                            <ThemeIcon size={40} radius="md" variant="light" color="yellow">
                                <IconBolt size={24} />
                            </ThemeIcon>
                            <div style={{ flex: 1 }}>
                                <Text size="lg" fw={500}>{t('resources.energyTitle', 'Energy Management')}</Text>
                                <Text size="sm" c="dimmed">
                                    {t('resources.energyDesc', 'Track energy consumption, sources, and storage.')}
                                </Text>
                            </div>
                        </Group>
                    </UnstyledButton>
                </Card>
            </SimpleGrid>
        </Container>
    );
};
