import React, { CSSProperties, useEffect, useState } from 'react';
import TimeseriesGraph from "../../measurements/ui/timeseriesGraph";
import { useParams } from "react-router-dom";
import { Fpf } from "../models/Fpf";
import { getFpf } from "../useCase/getFpf";
import {
    Container,
    Box,
    SimpleGrid,
    Button,
    Modal,
    useMantineTheme,
    Center,
    Text,
} from '@mantine/core';
import GrowingCycleList from "../../growthCycle/ui/growingCycleList";
import { GrowingCycleForm } from "../../growthCycle/ui/growingCycleForm";
import { CameraCarousel } from "../../camera/ui/CameraCarousel";
import {useAppDispatch, useAppSelector} from "../../../utils/Hooks";
import { setGrowingCycles } from "../../growthCycle/state/GrowingCycleSlice";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlant } from "@tabler/icons-react";
import { useAuth } from 'react-oidc-context';
import TimeRangeSelector from "../../../utils/TimeRangeSelector";
import {WeatherForecastDisplay} from "../../WeatherForecast/ui/WeatherForecastDisplay";
import ControllableActionOverview from "../../controllables/ui/controllableActionOverview";
import {setControllableAction} from "../../controllables/state/ControllableActionSlice";
import {getMyOrganizations} from "../../organization/useCase/getMyOrganizations";
import {showNotification} from "@mantine/notifications";

export const FpfOverview = () => {
    const theme = useMantineTheme();
    const [fpf, setFpf] = useState<Fpf | null>(null);
    const params = useParams();
    const { t } = useTranslation();
    const [isCameraActive, setCameraActive] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [showGrowingCycleForm, setShowGrowingCycleForm] = useState(false);
    const auth = useAuth();
    const { organizationId } = useParams<{ organizationId: string }>();
    const [dateRange, setDateRange] = useState<{from:string, to:string} |null>(null)
    const [isMember, setIsMember] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    //Redux Store
    const dispatch = useAppDispatch();
    const myOrganizationsSelector = useAppSelector((state) => state.organization.myOrganizations);

    useEffect(() => {
        if (organizationId && auth.isAuthenticated) {
            const org = myOrganizationsSelector.find((o) => o.id === organizationId);
            if (org) {
                setIsMember(true);
                setIsAdmin(org.membership.role === 'admin');
            }
        }
    }, [organizationId, auth.isAuthenticated, t, myOrganizationsSelector]);

    useEffect(() => {
        if (params?.fpfId) {
            getFpf(params.fpfId).then(resp => {
                setFpf(resp);
                dispatch(setGrowingCycles(resp.GrowingCycles));
                dispatch(setControllableAction(resp.ControllableAction));
                
            }).catch((error) => {
                showNotification({
                    title: t('common.loadingError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    }, [params, dispatch, t]);

    useEffect(() => {
        if (fpf?.Cameras?.some(camera => camera.isActive)) {
            setCameraActive(true);
        }
    }, [fpf]);

    // Explicitly type the style object as CSSProperties
    const scrollableStyle: CSSProperties = {
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        WebkitOverflowScrolling: 'touch',
        height: '100%',
        padding: '10px',
        scrollBehavior: 'smooth',
    };

    return (
        <Container fluid style={{ width: '100%', height: '100%' }}>
            {/* Modal for Adding a Growing Cycle */}
            <Modal
                opened={showGrowingCycleForm}
                onClose={() => setShowGrowingCycleForm(false)}
                centered
                title={t("Add Growing Cycle")}
            >
                <GrowingCycleForm
                    fpfId={fpf?.id ?? ""}
                    toEditGrowingCycle={null}
                    closeForm={() => setShowGrowingCycleForm(false)}
                />
            </Modal>
            {isMobile ? (
                // Single scrollable container for mobile devices
                <Box style={{ ...scrollableStyle, height: '88vh' }}>
                    {/* Camera Carousel comes first */}
                    {fpf?.Cameras && fpf.Cameras.length > 0 && isCameraActive && (
                        <Box
                            style={{
                                borderRadius: '10px',
                                marginBottom: '32px',
                            }}
                        >
                            <CameraCarousel camerasToDisplay={fpf?.Cameras ?? []} />
                        </Box>
                    )}

                    {/* Weather forecast section */}
                    {fpf?.Location?.gatherForecasts && (
                        <Box
                            style={{
                                borderRadius: '10px',
                                marginBottom: '20px',
                            }}
                        >
                            <WeatherForecastDisplay location={fpf.Location} />
                        </Box>
                    )}

                    {/* Sensor graphs come next */}
                    {fpf?.Sensors && fpf.Sensors.length > 0 ? (
                        <>
                            {fpf.Sensors.map((sensor) => (
                                <Box
                                    key={sensor.id}
                                    style={{
                                        borderRadius: '10px',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <TimeseriesGraph sensor={sensor} dates={dateRange}/>
                                </Box>
                            ))}
                        </>
                    ) : (
                        <Center style={{ padding: '20px', minHeight: '100px' }}>
                            <IconPlant size={24} style={{ marginRight: '8px' }} />
                            <Text c="dimmed">{t("No sensors added yet")}</Text>
                        </Center>
                    )}

                    {fpf?.ControllableAction && fpf.ControllableAction.length > 0 && isMember && (
                        <Box
                            style={{
                                borderRadius: '10px',
                                marginBottom: '20px',
                            }}
                        >
                            <ControllableActionOverview fpfId={fpf.id} />
                        </Box>
                    )}

                    {/* Growing Cycle Section: only render if cycles exist or user is signed in */}
                    {fpf && (((fpf.GrowingCycles ?? []).length > 0) || auth.user) && (
                        <Box
                            style={{
                                borderRadius: '10px',
                                padding: '1rem',
                            }}
                        >
                            {(fpf.GrowingCycles ?? []).length > 0 ? (
                                <GrowingCycleList fpfId={fpf.id} isAdmin={isAdmin} />
                            ) : (
                                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="light"
                                        leftSection={<IconPlant />}
                                        onClick={() => setShowGrowingCycleForm(true)}
                                        color={theme.colors.blue[6]}
                                    >
                                        {t("growingCycleForm.addCycle")}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            ) : (
                // Desktop layout with two separate scrollable areas
                <SimpleGrid cols={2} spacing="xs" style={{ height: '88vh', overflow: 'hidden' }}>
                    {/* Left section: Sensor Graphs */}
                    <Box style={scrollableStyle}>
                        {/*Weather Forecast */}
                        {fpf?.Location && fpf?.Location.gatherForecasts && (
                            <Box
                                style={{
                                    borderRadius: '10px',
                                    marginBottom: '30px',
                                }}
                            >
                                <WeatherForecastDisplay location={fpf.Location} />
                            </Box>
                        )}

                        <TimeRangeSelector onDateChange={setDateRange} defaultSelected={true} />
                        {fpf?.Sensors && fpf.Sensors.length > 0 ? (

                             fpf.Sensors.map((sensor) => (
                                <Box
                                    key={sensor.id}
                                    style={{
                                        borderRadius: '10px',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <TimeseriesGraph sensor={sensor} dates={dateRange} />
                                </Box>
                            ))
                        ) : (
                            <Center style={{ padding: '20px', minHeight: '100px' }}>
                                <IconPlant size={24} style={{ marginRight: '8px' }} />
                                <Text c="dimmed">{t("No sensors added yet")}</Text>
                            </Center>
                        )}
                    </Box>

                    {/* Right section: Camera Carousel, Controllables & Growing Cycle Section */}
                    <Box style={scrollableStyle}>
                        {/*Camera Section*/}
                        {fpf?.Cameras && fpf.Cameras.length > 0 && isCameraActive && (
                            <Box
                                style={{
                                    borderRadius: '10px',
                                    marginBottom: '32px',
                                }}
                            >
                                <CameraCarousel camerasToDisplay={fpf.Cameras} />
                            </Box>
                        )}
                        {/*Controllable Sectiojn*/}
                        {fpf?.ControllableAction && fpf.ControllableAction.length > 0 && isMember && (
                            <Box
                                style={{
                                    borderRadius: '10px',
                                    padding: '1rem',
                                }}
                            >
                                <ControllableActionOverview fpfId={fpf.id} />
                            </Box>
                        )}
                        {/*Growing Cycle Section*/}
                        {fpf && (((fpf.GrowingCycles ?? []).length > 0) || auth.user) && (
                            <Box
                                style={{
                                    borderRadius: '10px',
                                    padding: '1rem',
                                }}
                            >
                                {(fpf.GrowingCycles ?? []).length > 0 ? (
                                    <GrowingCycleList fpfId={fpf.id} isAdmin={isAdmin} />
                                ) : (
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="light"
                                            leftSection={<IconPlant />}
                                            onClick={() => setShowGrowingCycleForm(true)}
                                            color={theme.colors.blue[6]}
                                        >
                                            {t("growingCycleForm.addCycle")}
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </SimpleGrid>
            )}
        </Container>
    );
};
