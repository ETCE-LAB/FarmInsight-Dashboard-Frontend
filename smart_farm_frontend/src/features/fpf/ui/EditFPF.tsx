import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { getFpf } from "../useCase/getFpf";
import { FpfForm } from "./fpfForm";
import { getOrganization } from "../../organization/useCase/getOrganization";
import { Organization } from "../../organization/models/Organization";
import { Card, Stack, Text, Flex, Badge, Title, Grid, Modal, Button } from "@mantine/core";
import { Sensor } from "../../sensor/models/Sensor";
import { SensorList } from "../../sensor/ui/SensorList";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/store";
import { CameraList } from "../../camera/ui/CameraList";
import { Camera } from "../../camera/models/camera";
import { useTranslation } from "react-i18next";
import { IconEdit, IconBolt } from "@tabler/icons-react";
import { receiveUserProfile } from "../../userProfile/useCase/receiveUserProfile";
import { useAppDispatch } from "../../../utils/Hooks";
import {updatedFpf} from "../state/FpfSlice";
import { LogMessageModalButton } from "../../logMessages/ui/LogMessageModalButton";
import {ResourceType} from "../../logMessages/models/LogMessage";
import {ControllableActionList} from "../../controllables/ui/controllableActionList";
import {setControllableAction} from "../../controllables/state/ControllableActionSlice";
import {ActionQueueList} from "../../controllables/ui/actionQueueList";
import {HardwareList} from "../../hardware/ui/hardwareList";
import {Hardware} from "../../hardware/models/hardware";
import {showNotification} from "@mantine/notifications";
import {useAuth} from "react-oidc-context";
import {AuthRoutes} from "../../../utils/Router";
import {ModelList} from "../../model/ui/ModelList";
import {Model} from "../../model/models/Model";


export const EditFPF: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { organizationId, fpfId } = useParams();
    const { t } = useTranslation();

    const [organization, setOrganization] = useState<Organization>();
    const [sensors, setSensors] = useState<Sensor[]>();
    const [models, setModels] = useState<Model[]>();
    const [cameras, setCameras] = useState<Camera[]>();
    const [hardware, setHardware] = useState<Hardware[]>();

    const [editModalOpen, setEditModalOpen] = useState(false);  // State to control modal visibility

    const SensorEventListener = useSelector((state: RootState) => state.sensor.receivedSensorEvent);
    const ModelEventListener = useSelector((state: RootState) => state.model.receivedModelEvent);
    const CameraEventListener = useSelector((state: RootState) => state.camera.createdCameraEvent);
    const fpfCreatedEventListener = useSelector((state: RootState) => state.fpf.createdFpfEvent);

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const fpf = useSelector((state: RootState) => state.fpf.fpf);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (auth.isAuthenticated) {
            if (fpf && organization) {
                receiveUserProfile().then((user) => {
                    const userIsAdmin = organization.memberships.some(
                        (member) => member.userprofile.id === user.id && member.membershipRole === "admin"
                    );
                    setIsAdmin(userIsAdmin);
                }).catch((error) => {
                    showNotification({
                        title: t('common.loadError'),
                        message: `${error}`,
                        color: 'red',
                    });
                });
            }
        } else {
            navigate(AuthRoutes.signin);
        }
    }, [auth.isAuthenticated, fpf, navigate, organization, t]);
    
    useEffect(() => {
        if (auth.isAuthenticated && fpfId) {
            getFpf(fpfId).then(resp => {
                dispatch(updatedFpf(resp));
                dispatch(setControllableAction(resp.ControllableAction));
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [auth.isAuthenticated, fpfId, fpfCreatedEventListener, dispatch, t]);

    useEffect(() => {
        if (fpf?.Sensors && fpf.Sensors.length >= 1) {
            setSensors(fpf.Sensors);
        }
        if (fpf?.Models && fpf.Models.length >= 1) {
            setModels(fpf.Models);
        }
        if (fpf?.Hardware && fpf.Hardware.length >= 1) {
            setHardware(fpf.Hardware);
        }
    }, [fpf]);



    useEffect(() => {
        if (auth.isAuthenticated && organizationId) {
            getOrganization(organizationId).then(resp => {
                setOrganization(resp);
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [auth.isAuthenticated, organizationId, t]);

    useEffect(() => {
        if (fpfId) {
            getFpf(fpfId).then((resp) => {
                setSensors(resp.Sensors);
                setModels(resp.Models);
                setCameras(resp.Cameras);
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [SensorEventListener, ModelEventListener, CameraEventListener]);


    return (
        <Stack gap={"md"}>
            <Card padding="xl" radius="md">
                <Grid>
                    <Grid.Col span={12}>
                        <Flex align="center" style={{ marginBottom: "10px" }}>
                            <Title order={2}>
                                {'FPF-' + t("header.name")}: {fpf.name}
                            </Title>
                            {isAdmin && (
                                <IconEdit
                                    size={24}
                                    onClick={() => setEditModalOpen(true)}
                                    style={{
                                        cursor: 'pointer',
                                        color: '#199ff4',
                                        marginLeft: "auto",
                                    }}
                                />
                            )}
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Text size="lg" fw="bold" c="dimmed">
                            {t('header.status')}:{" "}
                            <Badge color={fpf.isPublic ? "green" : "red"} variant="light" size="sm">
                                {fpf.isPublic ? t('header.public') : t('header.private')}
                            </Badge>
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Flex justify="space-between">
                            <Text size="lg" fw="bold" c="dimmed">
                                {t('fpf.address')}: {fpf.Location?.name || t('fpf.noAddress')}
                            </Text>
                            <Flex gap="sm">
                                <Button 
                                    variant="light" 
                                    color="yellow" 
                                    leftSection={<IconBolt size={16} />}
                                    onClick={() => navigate(`/organization/${organizationId}/fpf/${fpfId}/energy`)}
                                >
                                    {t('energy.dashboardTitle')}
                                </Button>
                                <LogMessageModalButton resourceType={ResourceType.FPF} resourceId={fpfId}></LogMessageModalButton>
                            </Flex>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Card>

            <Card padding="lg" radius="md">
                <SensorList sensorsToDisplay={sensors} fpfId={fpf.id} isAdmin={isAdmin} />
            </Card>

            <Card padding="lg" radius="md">
                <ModelList modelsToDisplay={models} fpfId={fpf.id} isAdmin={isAdmin} />
            </Card>

            <Card padding="lg" radius="md">
                <CameraList camerasToDisplay={cameras} fpfId={fpf.id} isAdmin={isAdmin} />
            </Card>

            <Card padding="lg" radius="md">
                <ControllableActionList isAdmin={isAdmin} />
            </Card>

            <Card padding="lg" radius="md">
                <HardwareList hardwareToDisplay={hardware} fpfId={fpf.id} isAdmin={isAdmin} />
            </Card>

            <Card padding="lg" radius="md">
                <ActionQueueList fpfId={fpf.id} />
            </Card>

            {/* Edit FPF Modal */}
            <Modal
                opened={editModalOpen}
                onClose={() => setEditModalOpen(false)}  // Close modal when canceled
                title={t('fpf.editFpF')}
                centered
            >
                {organization && fpf &&
                    <FpfForm organizationId={organization.id} toEditFpf={fpf} close={setEditModalOpen} />
                }
            </Modal>
        </Stack>
    );
};
