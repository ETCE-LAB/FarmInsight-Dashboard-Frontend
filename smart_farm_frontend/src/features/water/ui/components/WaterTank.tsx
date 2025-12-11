import React, { useState, useMemo, useEffect } from 'react';
import { Badge, Box, Card, Text, useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface WaterTankProps {
    level: number; // Percentage 0-100
    capacity?: number;
    weatherCode?: number; // WMO Weather Code
    temperature?: number; // Celsius
}

export const WaterTank: React.FC<WaterTankProps> = React.memo(({ level, capacity, weatherCode = 0, temperature = 20 }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const [displayedLevel, setDisplayedLevel] = useState(level);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDisplayedLevel(Math.min(Math.max(level, 0), 100));
        }, 100);
        return () => clearTimeout(timeout);
    }, [level]);

    const isSunny = weatherCode === 0 || weatherCode === 1;
    const isCloudy = weatherCode === 2 || weatherCode === 3;
    const isFoggy = weatherCode === 45 || weatherCode === 48;

    const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);

    const isSnowy = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);

    const isStormy = weatherCode >= 95;

    const isFrozen = temperature <= 0;

    const [splashes, setSplashes] = useState<{ id: number, x: number }[]>([]);

    const handleTankClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isFrozen) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const relativeX = (x / rect.width) * 100;

        const newSplash = { id: Date.now(), x: relativeX };
        setSplashes(prev => [...prev, newSplash]);

        setTimeout(() => {
            setSplashes(prev => prev.filter(s => s.id !== newSplash.id));
        }, 1000);
    };

    const rainDrops = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: 0.4 + Math.random() * 0.4,
        animationDelay: Math.random()
    })), []);

    const snowFlakes = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 3,
        animationDelay: Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.6,
        size: 2 + Math.random() * 3
    })), []);

    const bubbles = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: Math.random() * 80 + 10,
        width: Math.random() * 6 + 4,
        height: Math.random() * 6 + 4,
        animationDuration: Math.random() * 3 + 2,
        animationDelay: Math.random() * 2
    })), []);

    const rainRipples = useMemo(() => Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        left: 20 + Math.random() * 60,
        top: 20 + Math.random() * 60,
        animationDelay: Math.random()
    })), []);

    const waterColorStart = isFrozen ? '#E0F7FA' : theme.colors.blue[8];
    const waterColorMid = isFrozen ? '#B2EBF2' : theme.colors.cyan[4];
    const waterOpacity = isFrozen ? 0.9 : 0.8;
    const animationState = isFrozen ? 'paused' : 'running';
    const structureColor = '#263238';
    const glassBase = '#1A1B1E';
    let glassTint = 'transparent';
    if (isFrozen) glassTint = 'rgba(179, 229, 252, 0.1)'; // Icy tint
    else if (isStormy) glassTint = 'rgba(20, 20, 30, 0.3)';
    else if (isRainy) glassTint = 'rgba(33, 150, 243, 0.05)';
    else if (isSunny) glassTint = 'rgba(255, 235, 59, 0.05)';
    else if (isCloudy || isFoggy) glassTint = 'rgba(144, 164, 174, 0.1)';

    let lightOverlay = 'none';
    if (isSunny && !isFrozen) {
        lightOverlay = `radial-gradient(circle at 80% 10%, rgba(255, 235, 59, 0.15) 0%, transparent 60%)`;
    } else if (isStormy) {
        lightOverlay = `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)`;
    } else if (isRainy) {
        lightOverlay = `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)`;
    } else if ((isCloudy || isFoggy) && !isFrozen) {
        lightOverlay = `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)`;
    }

    const styles = `
        .tank-card {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            position: relative;
            background-color: ${glassBase};
            transition: background 1s ease;
        }

        /* Architectural Structure (CSS Drawing) */
        .greenhouse-structure {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 1;
            pointer-events: none;
            
            /* Glass Tint */
            background-color: ${glassTint};
            
            /* Structural Beams (Vertical & Horizontal perspective) */
            background-image:
                /* Vertical Beams */
                linear-gradient(90deg, 
                    transparent 19%, ${structureColor} 19%, ${structureColor} 20%, transparent 20%,
                    transparent 39%, ${structureColor} 39%, ${structureColor} 40%, transparent 40%,
                    transparent 59%, ${structureColor} 59%, ${structureColor} 60%, transparent 60%,
                    transparent 79%, ${structureColor} 79%, ${structureColor} 80%, transparent 80%
                ),
                /* Horizontal Beams (Perspective curved) */
                linear-gradient(to bottom, 
                    ${structureColor} 2px, transparent 2px
                );
            background-size: 100% 100%, 100% 33%; /* Grid spacing */
            
            /* Depth Shadow (Vignette) */
             box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
        }
        
        /* Subtle Perspective Roof Lines */
        .greenhouse-roof {
             position: absolute;
             top: 0; left: 0; width: 100%; height: 40%;
             background: repeating-linear-gradient(
                160deg,
                transparent,
                transparent 50px,
                rgba(255,255,255,0.03) 50px,
                rgba(255,255,255,0.03) 51px
             );
             z-index: 1;
             pointer-events: none;
             mask-image: linear-gradient(to bottom, black, transparent);
        }

        /* Lighting Overlay */
        .lighting-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: ${lightOverlay};
            pointer-events: none;
            z-index: 2;
            transition: background 1s ease;
            mix-blend-mode: screen; /* Lighten mode */
        }

        .tank-container {
            perspective: 1000px;
            width: 200px;
            height: 300px;
            margin: 0 auto;
            position: relative;
            cursor: pointer;
            z-index: 10; /* Above background elements */
            margin-top: 20px;
        }

        .cylinder {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transform: rotateX(-10deg);
        }

        /* Weather Overlay Container (Rain/Snow) */
        .weather-overlay {
            position: absolute;
            top: -50px;
            left: -20px;
            width: 240px;
            height: 400px;
            pointer-events: none;
            z-index: 20;
            overflow: hidden;
            mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
        }

        /* Rain Animation */
        .rain-drop {
            position: absolute;
            width: 2px;
            height: 10px;
            background: rgba(255, 255, 255, 0.4);
            top: -20px;
            animation: fall linear infinite;
        }
        
        /* Snow Animation */
        .snow-flake {
            position: absolute;
            background: white;
            border-radius: 50%;
            top: -20px;
            animation: fall linear infinite;
        }

        @keyframes fall {
            to { transform: translateY(400px); }
        }

         /* Sun Shine Animation (Subtler) */
        .sun-glare {
            position: absolute;
            top: -40px;
            right: -40px;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
            filter: blur(25px);
            z-index: 30;
            opacity: 0.6;
            animation: pulse-sun 4s infinite ease-in-out;
        }
        
         /* Cloud Shadow Animation */
        .cloud-shadow {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
            z-index: 25;
            pointer-events: none;
            animation: cloud-pass 10s infinite alternate ease-in-out;
            opacity: 0.8; /* Increased visibility */
            mix-blend-mode: multiply; /* Better blending */
        }
        
        /* Fog Overlay */
        .fog-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 100%);
            z-index: 28;
            pointer-events: none;
            filter: blur(20px);
            animation: fog-drift 20s infinite alternate linear;
        }
        
        @keyframes fog-drift {
            0% { transform: translateX(-10px); opacity: 0.6; }
            100% { transform: translateX(10px); opacity: 0.8; }
        }
        
        /* Storm Overlay (Lightning) */
        .storm-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: white; /* For flash */
            opacity: 0;
            z-index: 40;
            pointer-events: none;
            mix-blend-mode: overlay;
            animation: lightning-flash 5s infinite;
        }
        
        @keyframes lightning-flash {
            0%, 95% { opacity: 0; }
            96% { opacity: 0.8; }
            96.5% { opacity: 0; }
            97% { opacity: 0; }
            98% { opacity: 0.5; }
            98.5% { opacity: 0; }
            100% { opacity: 0; }
        }
        
        /* Ice Overlay Texture */
        .ice-texture {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
            z-index: 22;
            pointer-events: none;
            mix-blend-mode: overlay;
            opacity: ${isFrozen ? 0.4 : 0};
            transition: opacity 1s;
        }

        @keyframes pulse-sun {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.5; }
        }
        
         @keyframes cloud-pass {
            0% { background-position: 0% 0%; opacity: 0.3; }
            100% { background-position: 100% 0%; opacity: 0.6; }
        }

        .glass-back {
            position: absolute;
            top: 0;
            width: 200px;
            height: 300px;
            background: linear-gradient(to right, rgba(200,200,255,0.05), rgba(200,200,255,0.02) 40%, rgba(200,200,255,0.02) 60%, rgba(200,200,255,0.05));
            border: 1px solid rgba(255,255,255,0.1);
            border-bottom-left-radius: 100px 20px;
            border-bottom-right-radius: 100px 20px;
            z-index: 1;
        }

        .rim-top {
            position: absolute;
            top: -20px;
            left: 0;
            width: 200px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid rgba(200,200,255,0.3);
            background: rgba(255,255,255,0.05);
            z-index: 50; 
            box-shadow: 0 0 5px rgba(255,255,255,0.1);
        }

        .rim-bottom {
            position: absolute;
            bottom: -20px;
            left: 0;
            width: 200px;
            height: 40px;
            border-radius: 50%;
            background: rgba(200,200,255,0.1);
            border: 1px solid rgba(200,200,255,0.2);
            z-index: 0;
            box-shadow: 0 15px 30px rgba(0,0,0,0.4);
        }

        .water-column {
            position: absolute;
            bottom: 0;
            left: 5px; 
            width: 190px;
            height: ${displayedLevel}%;
            background: linear-gradient(to right, 
                ${waterColorStart}, 
                ${waterColorMid} 50%, 
                ${waterColorStart});
            opacity: ${waterOpacity};
            transition: height 2s ease-in-out, background 1s ease, opacity 1s;
            z-index: 2;
            border-bottom-left-radius: 95px 20px;
            border-bottom-right-radius: 95px 20px;
        }

        /* Multi-layer Wave Animation */
        .wave-layer {
            position: absolute;
            top: -20px;
            left: 0;
            width: 190px;
            height: 40px;
            border-radius: 50%;
            pointer-events: none;
            transition: background 1s;
        }

        .wave-1 {
            background: rgba(255, 255, 255, 0.1);
            animation: wave-slosh-1 4s ease-in-out infinite;
            animation-play-state: ${animationState};
            z-index: 4;
            transform-origin: 50% 50%;
        }

        .wave-2 {
            background: rgba(255, 255, 255, 0.15);
            animation: wave-slosh-2 3s ease-in-out infinite;
            animation-play-state: ${animationState};
            z-index: 5;
            transform-origin: 50% 50%;
        }

        .wave-main {
            background: radial-gradient(circle at 50% 50%, 
                rgba(255,255,255,0.9) 0%, 
                ${waterColorMid} 40%, 
                ${waterColorStart} 100%);
            z-index: 3;
            box-shadow: 0 0 30px ${waterColorMid}; 
            animation: wave-breathe 5s ease-in-out infinite;
            animation-play-state: ${animationState};
            transition: background 1s, box-shadow 1s;
        }

        @keyframes wave-slosh-1 {
            0%, 100% { transform: scale(1) rotate(0deg) translateX(0); }
            50% { transform: scale(1.02) rotate(2deg) translateX(2px); }
        }

        @keyframes wave-slosh-2 {
            0%, 100% { transform: scale(1) rotate(0deg) translateX(0); }
            50% { transform: scale(0.98) rotate(-3deg) translateX(-3px); }
        }

        @keyframes wave-breathe {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.05); }
        }
        
        .interaction-splash {
             position: absolute;
             width: 10px;
             height: 10px;
             border: 2px solid white;
             border-radius: 50%;
             top: 50%;
             transform: translate(-50%, -50%);
             opacity: 0;
             animation: big-splash 0.8s ease-out forwards;
             z-index: 10;
        }
        
        @keyframes big-splash {
             0% { width: 0; height: 0; opacity: 1; border-width: 4px; }
             100% { width: 100px; height: 30px; opacity: 0; border-width: 0; }
        }

        /* Rain impact on water surface */
        .rain-ripple {
             position: absolute;
             width: 10px;
             height: 10px;
             border: 1px solid white;
             border-radius: 50%;
             top: 50%;
             left: 50%;
             opacity: 0;
             animation: ripple-splash 1s infinite;
        }
        
        @keyframes ripple-splash {
             0% { width: 0; height: 0; opacity: 1; }
             100% { width: 50px; height: 10px; opacity: 0; }
        }

        .bubbles {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 5;
            pointer-events: none;
        }
        
        .bubble {
            position: absolute;
            bottom: -10px;
            background: rgba(255,255,255,0.4);
            border-radius: 50%;
            animation: rise 4s infinite ease-in;
            animation-play-state: ${animationState};
        }

        @keyframes rise {
            0% { bottom: -10px; transform: translateX(0); opacity: 0; }
            20% { opacity: 1; }
            100% { bottom: 100%; transform: translateX(-20px); opacity: 0; }
        }

        /* Front Glass Shine */
        .glass-front-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(105deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0) 30%);
            z-index: 20;
            pointer-events: none;
            border-radius: 10px; 
        }
    `;

    return (
        <Card padding="xl" radius="md" withBorder className="tank-card">
            <style>{styles}</style>

            <Box className="greenhouse-structure" />
            <Box className="greenhouse-roof" />
            <Box className="lighting-overlay" />
            {isStormy && <Box className="storm-overlay" />}
            {isFoggy && <Box className="fog-overlay" />}

            <Text fw={500} size="lg" mb={40} c="dimmed" style={{ zIndex: 30, position: 'relative' }}>
                {t('water.tankLevel', 'Water Tank Level')}
            </Text>

            <Box className="tank-container" onClick={handleTankClick}>
                {isRainy && (
                    <Box className="weather-overlay">
                        {rainDrops.map((drop) => (
                            <Box
                                key={`rain-${drop.id}`}
                                className="rain-drop"
                                style={{
                                    left: `${drop.left}%`,
                                    animationDuration: `${drop.animationDuration}s`,
                                    animationDelay: `${drop.animationDelay}s`
                                }}
                            />
                        ))}
                    </Box>
                )}

                {isSnowy && (
                    <Box className="weather-overlay">
                        {snowFlakes.map((flake) => (
                            <Box
                                key={`snow-${flake.id}`}
                                className="snow-flake"
                                style={{
                                    left: `${flake.left}%`,
                                    width: `${flake.size}px`,
                                    height: `${flake.size}px`,
                                    opacity: flake.opacity,
                                    animationDuration: `${flake.animationDuration}s`,
                                    animationDelay: `${flake.animationDelay}s`
                                }}
                            />
                        ))}
                    </Box>
                )}

                {isSunny && <Box className="sun-glare" />}
                {isCloudy && !isStormy && <Box className="cloud-shadow" />}

                <Box className="ice-texture" />

                <Box className="cylinder-base">
                    <Box className="rim-top" />
                    <Box className="glass-back" />

                    <Box className="water-column">
                        <Box className="wave-layer wave-1" />
                        <Box className="wave-layer wave-2" />

                        <Box className="wave-layer wave-main">
                            {splashes.map((splash) => (
                                <Box
                                    key={splash.id}
                                    className="interaction-splash"
                                    style={{ left: `${splash.x}%`, top: '50%', position: 'absolute' }}
                                />
                            ))}

                            {isRainy && !isFrozen && rainRipples.map((ripple) => (
                                <Box
                                    key={`ripple-${ripple.id}`}
                                    className="rain-ripple"
                                    style={{
                                        left: `${ripple.left}%`,
                                        top: `${ripple.top}%`,
                                        animationDelay: `${ripple.animationDelay}s`,
                                        position: 'absolute'
                                    }}
                                />
                            ))}
                        </Box>

                        <Box className="bubbles">
                            {bubbles.map((bubble) => (
                                <Box
                                    key={bubble.id}
                                    className="bubble"
                                    style={{
                                        left: `${bubble.left}%`,
                                        width: `${bubble.width}px`,
                                        height: `${bubble.height}px`,
                                        animationDuration: `${bubble.animationDuration}s`,
                                        animationDelay: `${bubble.animationDelay}s`
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Box className="glass-front-shine" />
                    <Box className="rim-bottom" />
                </Box>
            </Box>

            <Box mt="xl" style={{ textAlign: 'center', zIndex: 30 }}>
                <Text size="3rem" fw={800} c="white" style={{ textShadow: '0 0 10px #228BE6' }}>
                    {displayedLevel.toFixed(0)}%
                </Text>
                {capacity && (
                    <Text size="sm" c="dimmed">
                        {((displayedLevel / 100) * capacity).toFixed(0)} / {capacity} L
                    </Text>
                )}
                <Text size="xs" c={isRainy || isStormy ? 'blue.3' : isSunny ? 'yellow.3' : 'dimmed'} mt={5} fw={700} style={{ textTransform: 'uppercase' }}>
                    Weather Code: {weatherCode} | {temperature}°C {isFrozen && <Badge size="xs" color="cyan" variant="light">FROZEN</Badge>}
                </Text>
            </Box>
        </Card>
    );
});
