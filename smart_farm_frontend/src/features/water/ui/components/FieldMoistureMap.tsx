import React, { useMemo } from 'react';
import { Card, Text, SimpleGrid, Box, Tooltip, useMantineTheme, Group, Badge } from '@mantine/core';
import { IconPlant, IconSeeding, IconLeaf } from '@tabler/icons-react';

export const FieldMoistureMap = React.memo(() => {
    const theme = useMantineTheme();

    const fields = [
        { id: 1, moisture: 45, crop: 'Corn' }, { id: 2, moisture: 72, crop: 'Soy' }, { id: 3, moisture: 28, crop: 'Fallow' },
        { id: 4, moisture: 65, crop: 'Soy' }, { id: 5, moisture: 80, crop: 'Rice' }, { id: 6, moisture: 42, crop: 'Corn' },
        { id: 7, moisture: 35, crop: 'Wheat' }, { id: 8, moisture: 55, crop: 'Corn' }, { id: 9, moisture: 60, crop: 'Soy' },
        { id: 10, moisture: 25, crop: 'Fallow' }, { id: 11, moisture: 70, crop: 'Wheat' }, { id: 12, moisture: 50, crop: 'Rice' },
    ];

    const getMoistureData = (level: number) => {
        if (level < 30) return { color: '#8D6E63', label: 'Dry', icon: <IconSeeding size={16} color="#D7CCC8" /> }; // Brown
        if (level < 50) return { color: '#D4E157', label: 'Moderate', icon: <IconPlant size={16} color="#F9FBE7" /> }; // Yellow-Green
        if (level < 70) return { color: '#66BB6A', label: 'Moist', icon: <IconLeaf size={16} color="#E8F5E9" /> }; // Green
        return { color: '#26A69A', label: 'Wet', icon: <IconPlant size={16} color="#E0F2F1" /> }; // Teal/Green
    };

    const styles = `
        .map-container {
            position: relative;
            background: #1A1B1E radial-gradient(circle at 50% 50%, #25262B 0%, #1A1B1E 100%);
            overflow: hidden;
        }

        /* Subtle Grid Pattern */
        .grid-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            z-index: 1;
        }

        /* Satellite Scan Line Animation */
        .scan-line {
            position: absolute;
            top: 0;
            left: -100%;
            width: 150%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(34, 139, 230, 0.1) 50%, transparent 100%);
            transform: skewX(-20deg);
            animation: scan 4s linear infinite;
            pointer-events: none;
            z-index: 2;
        }

        @keyframes scan {
            0% { left: -100%; }
            100% { left: 150%; }
        }

        .field-cell {
            position: relative;
            z-index: 3;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        /* Organic border radiuses for fields to look natural */
        .field-cell:nth-child(odd) { border-radius: 8px 16px 8px 12px; }
        .field-cell:nth-child(even) { border-radius: 12px 8px 16px 8px; }
        .field-cell:nth-child(3n) { border-radius: 10px 10px 20px 6px; }

        .field-cell:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10;
        }

        .field-texture {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            opacity: 0.15;
            background-image: repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000),
            repeating-linear-gradient(45deg, #000 25%, #1A1B1E 25%, #1A1B1E 75%, #000 75%, #000);
            background-position: 0 0, 2px 2px;
            background-size: 4px 4px;
        }
    `;

    return (
        <Card
            radius="md"
            p="md"
            className="map-container"
            withBorder
        >
            <style>{styles}</style>
            <Box className="grid-overlay" />
            <Box className="scan-line" />

            <Group justify="space-between" mb="sm" style={{ zIndex: 10, position: 'relative' }}>
                <Text fw={600} size="sm" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>Field Moisture Values</Text>
                <Badge size="xs" variant="dot" color="green">Status</Badge>
            </Group>

            <SimpleGrid cols={3} spacing="xs" style={{ position: 'relative', zIndex: 3 }}>
                {fields.map((field) => {
                    const data = getMoistureData(field.moisture);
                    return (
                        <Tooltip
                            key={field.id}
                            label={
                                <Box p={4}>
                                    <Text size="xs" fw={700} c="white">Field {field.id} - {field.crop}</Text>
                                    <Group gap={4}>
                                        <Badge size="xs" color={field.moisture < 30 ? 'red' : 'teal'} variant="light">{data.label}</Badge>
                                        <Text size="xs" c="dimmed">{field.moisture}% Moisture</Text>
                                    </Group>
                                </Box>
                            }
                            color="dark"
                            withArrow
                        >
                            <Box
                                className="field-cell"
                                style={{
                                    height: '60px',
                                    backgroundColor: data.color,
                                    border: `1px solid ${theme.colors.dark[4]}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Box className="field-texture" />
                                <Box style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {data.icon}
                                    <Text size="10px" fw={800} c="rgba(255,255,255,0.9)" mt={2}>{field.moisture}%</Text>
                                </Box>
                            </Box>
                        </Tooltip>
                    );
                })}
            </SimpleGrid>
        </Card>
    );
});
