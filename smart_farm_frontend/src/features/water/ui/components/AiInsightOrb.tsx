import React, { useState } from 'react';
import { Box, Text, Transition, useMantineTheme } from '@mantine/core';
import { IconBrain } from '@tabler/icons-react';

export const AiInsightOrb = () => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    const styles = `
        @keyframes pulse-orb {
            0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(74, 222, 128, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }
    `;

    return (
        <Box style={{ position: 'relative', display: 'inline-block' }}>
            <style>{styles}</style>

            {/* The Orb */}
            <Box
                onClick={() => setOpened((o) => !o)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, ${theme.colors.green[3]}, ${theme.colors.green[7]}, ${theme.colors.green[9]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    animation: 'pulse-orb 2s infinite',
                    border: `2px solid ${theme.colors.green[2]}`,
                    zIndex: 100,
                    position: 'relative'
                }}
            >
                <IconBrain color="white" size={32} />
            </Box>

            {/* Insight Pop-out */}
            <Transition mounted={opened} transition="slide-up" duration={400} timingFunction="ease">
                {(styles) => (
                    <Box
                        style={{
                            ...styles,
                            position: 'absolute',
                            bottom: '80px', // Above the orb generally, or adjust based on layout
                            right: 0,
                            width: '250px',
                            background: 'rgba(20, 20, 20, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.colors.green[6]}`,
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: `0 4px 20px ${theme.colors.green[9]}`,
                            zIndex: 99
                        }}
                    >
                        <Text fw={700} c="green.4" mb={5} size="sm" tt="uppercase" style={{ letterSpacing: 1 }}>AI Insight</Text>
                        <Text size="sm" c="white" style={{ lineHeight: 1.4 }}>
                            Rain probability is high (85%). Recommended to pause irrigation for 24h to save 450L of water.
                        </Text>
                    </Box>
                )}
            </Transition>
        </Box>
    );
};
