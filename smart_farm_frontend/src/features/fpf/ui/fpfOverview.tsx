import React, { useEffect, useState } from 'react';
import TimeseriesGraph from "../../measurements/ui/timeseriesGraph";
import { useParams } from "react-router-dom";
import { Fpf } from "../models/Fpf";
import { getFpf } from "../useCase/getFpf";
import { Container, Box, SimpleGrid } from '@mantine/core';
import GrowingCycleList from "../../growthCycle/ui/growingCycleList";
import { CameraCarousel } from "../../camera/ui/CameraCarousel";
import { useAppDispatch } from "../../../utils/Hooks";
import { setGrowingCycles } from "../../growthCycle/state/GrowingCycleSlice";
import {useMediaQuery} from "@mantine/hooks";

export const FpfOverview = () => {
    const [fpf, setFpf] = useState<Fpf | null>(null);
    const dispatch = useAppDispatch();
    const params = useParams();
    const [isCameraActive, setCameraActive] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (params?.fpfId) {
            getFpf(params.fpfId).then(resp => {
                setFpf(resp);
                dispatch(setGrowingCycles(resp.GrowingCycles));
            });
        }
    }, [params, dispatch]);

    useEffect(() => {
        if (fpf?.Cameras?.some(camera => camera.isActive)) {
            setCameraActive(true);
        }
    }, [fpf]);

    return (
        <Container fluid style={{ width: '100%', height: '100%' }}>
            <SimpleGrid cols={isMobile? 1 : 2} spacing="lg" style={{ height: '88vh', overflow: 'hidden' }}>

                {/* Scrollable Graph Section */}
                <Box style={{
                    flex: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch',
                    height: '100%',
                    padding: '10px',
                    scrollBehavior: 'smooth'
                }}>
                    {fpf?.Sensors?.map((sensor) => (
                        <Box key={sensor.id} style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', marginBottom: '20px' }}>
                            <TimeseriesGraph sensor={sensor} />
                        </Box>
                    ))}
                </Box>

                {/* Scrollable Camera and Growing Cycle Section */}
                <Box style={{
                    flex: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch',
                    height: '100%',
                    padding: '10px',
                    scrollBehavior: 'smooth'
                }}>
                    {fpf?.Cameras && fpf.Cameras.length > 0 && isCameraActive && (
                        <Box style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
                            <CameraCarousel camerasToDisplay={fpf?.Cameras ?? []} />
                        </Box>
                    )}

                    {fpf && (
                        <Box style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            <GrowingCycleList fpfId={fpf.id} />
                        </Box>
                    )}
                </Box>
            </SimpleGrid>
        </Container>
    );
};
