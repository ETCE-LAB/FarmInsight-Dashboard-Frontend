import React from 'react';
import { Box, useMantineTheme, Text, Group } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';

interface PipeDistributionProps {
    active: boolean;
}

export const PipeDistribution: React.FC<PipeDistributionProps> = React.memo(({ active }) => {
    const theme = useMantineTheme();

    // CSS for animated flow
    const styles = `
        @keyframes flow {
            to { stroke-dashoffset: -40; }
        }
        .pipe-flow {
            stroke-dasharray: 10 5;
            animation: flow 1s linear infinite;
            filter: url(#glow);
        }
        .pipe-base {
            transition: all 0.3s ease;
        }
    `;

    return (
        <Box style={{ position: 'relative', height: 100, width: '100%' }}>
            <style>{styles}</style>

            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                    <filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="300" height="120">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={theme.colors.gray[8]} />
                        <stop offset="50%" stopColor={theme.colors.gray[6]} />
                        <stop offset="100%" stopColor={theme.colors.gray[8]} />
                    </linearGradient>
                </defs>

                {/* Main Pipe - Straight Line Vertically Centered */}
                {/* Extending to 255 to ensure it tucks behind the icon */}
                <path
                    d="M0 50 L255 50"
                    stroke="url(#pipeGradient)"
                    strokeWidth="10"
                    fill="none"
                    className="pipe-base"
                />

                {/* Active Water Flow */}
                {active && (
                    <path
                        d="M0 50 L255 50"
                        stroke={theme.colors.cyan[4]}
                        strokeWidth="6"
                        fill="none"
                        className="pipe-flow"
                        strokeLinecap="butt"
                    />
                )}

                {/* Junction Node (Optional, kept for detail but centered) */}
                <circle cx="8" cy="50" r="10" fill={theme.colors.gray[7]} stroke={theme.colors.gray[9]} strokeWidth={2} />
            </svg>

            {/* Greenhouse Label / Icon */}
            {/* Positioned exactly at the pipe end (80%) and vertically centered */}
            <Box style={{
                position: 'absolute',
                left: '85%',
                top: '30%',
                paddingLeft: '0', // No gap
                zIndex: 10 // Ensure it sits on top of the pipe end
            }}>
                <Group gap={8} style={{ whiteSpace: 'nowrap' }}>
                    <IconHome size={28} color={theme.colors.green[6]} />
                    <Text size="md" fw={600}>Greenhouse</Text>
                </Group>
            </Box>
        </Box>
    );
});
