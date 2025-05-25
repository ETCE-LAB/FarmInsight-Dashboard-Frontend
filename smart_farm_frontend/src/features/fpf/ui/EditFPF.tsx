import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFpf } from "../useCase/getFpf";
import { FpfForm } from "./fpfForm";
import { getOrganization } from "../../organization/useCase/getOrganization";
import { Organization } from "../../organization/models/Organization";
import { Card, Stack, Text, Flex, Badge, Title, Grid, Modal } from "@mantine/core";
import { Sensor } from "../../sensor/models/Sensor";
import { SensorList } from "../../sensor/ui/SensorList";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/store";
import { CameraList } from "../../camera/ui/CameraList";
import { Camera } from "../../camera/models/camera";
import { useTranslation } from "react-i18next";
import { IconEdit } from "@tabler/icons-react";
import { receiveUserProfile } from "../../userProfile/useCase/receiveUserProfile";
import { useAppDispatch } from "../../../utils/Hooks";
import {updatedFpf} from "../state/FpfSlice";
import { LogMessageModalButton } from "../../logMessages/ui/LogMessageModalButton";
import {ResourceType} from "../../logMessages/models/LogMessage";
import {ControllableActionList} from "../../controllables/ui/controllableActionList";
import {setControllableAction} from "../../controllables/state/ControllableActionSlice";
import {ActionQueueList} from "../../controllables/ui/actionQueueList";


export const EditFPF: React.FC = () => {
    const { organizationId, fpfId } = useParams();
    const { t } = useTranslation();
    const [organization, setOrganization] = useState<Organization>();

    const [sensors, setSensors] = useState<Sensor[]>();
    const [cameras, setCameras] = useState<Camera[]>();

    const [editModalOpen, setEditModalOpen] = useState(false);  // State to control modal visibility


    const SensorEventListener = useSelector((state: RootState) => state.sensor.receivedSensorEvent);
    const CameraEventListener = useSelector((state: RootState) => state.camera.createdCameraEvent);
    const fpfCreatedEventListener = useSelector((state: RootState) => state.fpf.createdFpfEvent);

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const fpf = useSelector((state: RootState) => state.fpf.fpf);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (fpfId) {
            getFpf(fpfId).then(resp => {
                dispatch(updatedFpf(resp));
                dispatch(setControllableAction(resp.ControllableAction));
            });
        }
    }, [fpfId, fpfCreatedEventListener]);

    useEffect(() => {
        if (fpf?.Sensors && fpf.Sensors.length >= 1) {
            setSensors(fpf.Sensors);
        }
    }, [fpf]);

    useEffect(() => {
        if (organizationId) {
            getOrganization(organizationId).then(resp => {
                setOrganization(resp);
            });
        }
    }, [organizationId]);

    useEffect(() => {
        if (fpfId) {
            getFpf(fpfId).then((resp) => {
                setSensors(resp.Sensors);
            });
        }
    }, [SensorEventListener]);

    useEffect(() => {
        if (fpfId) {
            getFpf(fpfId).then((resp) => {
                setCameras(resp.Cameras);
            });
        }
    }, [CameraEventListener]);



    useEffect(() => {
        if (fpf && organization) {
            receiveUserProfile().then((user) => {
                const userIsAdmin = organization.memberships.some(
                    (member) => member.userprofile.id === user.id && member.membershipRole === "admin"
                );
                setIsAdmin(userIsAdmin);
            });
        }
    }, [fpf, organization]);

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
                            {fpf.Location && (
                                <Text size="lg" fw="bold" c="dimmed">
                                    {t('fpf.address')}: {fpf.Location.name || t('fpf.noAddress')}
                                </Text>
                            )}
                            <LogMessageModalButton resourceType={ResourceType.FPF} resourceId={fpfId}></LogMessageModalButton>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Card>

            <Card padding="lg" radius="md">
                <SensorList sensorsToDisplay={sensors} fpfId={fpf.id} isAdmin={isAdmin} />
            </Card>

            <Card padding="lg" radius="md">
                <CameraList camerasToDisplay={cameras} isAdmin={isAdmin} />
            </Card>

            <Card padding="lg" radius="md">
                <ControllableActionList isAdmin={isAdmin} />
            </Card>

            {fpfId &&
                <Card padding="lg" radius="md">
                    <ActionQueueList fpfId={fpfId} />
                </Card>
            }

            {/* Edit FPF Modal */}
            <Modal
                opened={editModalOpen}
                onClose={() => setEditModalOpen(false)}  // Close modal when canceled
                title={t('fpf.editFpF')}
                centered
            >
                <FpfForm toEditFpf={fpf} close={setEditModalOpen} />
            </Modal>
        </Stack>
    );
};
