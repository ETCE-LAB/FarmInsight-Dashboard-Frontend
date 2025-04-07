import React, { useState } from "react";
import {Badge, Box, Flex, Group, Modal, Table, Text} from "@mantine/core";
import { IconCirclePlus, IconEdit, IconVideo, IconVideoOff } from "@tabler/icons-react";
import { Camera, EditCamera } from "../models/camera";
import { CameraForm } from "./CameraForm";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {ResourceType} from "../../logMessages/models/LogMessage";
import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";

export const CameraList: React.FC<{ camerasToDisplay?: Camera[], isAdmin:Boolean }> = ({ camerasToDisplay, isAdmin }) => {
    const [CameraModalOpen, setCameraModalOpen] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState<EditCamera | undefined>(undefined);
    const { organizationId, fpfId } = useParams();
    const { t } = useTranslation();

    const onClickEdit = (camera: Camera) => {
        if (fpfId) {
            const editCamera: EditCamera = {
                fpfId: fpfId,
                id: camera.id,
                name: camera.name,
                location: camera.location,
                modelNr: camera.modelNr,
                resolution: camera.resolution,
                isActive: camera.isActive,
                intervalSeconds: camera.intervalSeconds,
                snapshotUrl: camera.snapshotUrl,
                livestreamUrl: camera.livestreamUrl,
            };

            setSelectedCamera(editCamera);
            setCameraModalOpen(true);
        }
    };

    return (
        <Box>
            {/* Camera Modal */}
            <Modal
                opened={CameraModalOpen}
                onClose={() => setCameraModalOpen(false)}
                title={selectedCamera ? t("camera.editCamera") : t("camera.addCamera")}
                centered
            >
                <CameraForm toEditCamera={selectedCamera} setClosed={setCameraModalOpen} />
            </Modal>

            {/* Header with Add Button */}
            <Group mb="md" justify="space-between">
                <h2>{t('camera.cameras')}</h2>
                {isAdmin &&
                <IconCirclePlus
                    size={25}
                    stroke={2}
                    color={"#199ff4"}
                    onClick={() => setCameraModalOpen(true)}
                    style={{ cursor: "pointer" }}
                />
                }
            </Group>

            {/* Conditional Rendering of Table */}
            {camerasToDisplay && camerasToDisplay.length > 0 ? (
                <Box style={{ overflowX: "auto" }}>
                    <Table highlightOnHover withColumnBorders style={{ minWidth: "100%" }}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t("header.name")}</Table.Th>
                                <Table.Th>{t("camera.location")}</Table.Th>
                                <Table.Th>{t("camera.resolution")}</Table.Th>
                                <Table.Th>{t("camera.modelNr")}</Table.Th>
                                <Table.Th>{t("camera.intervalSeconds")}</Table.Th>
                                <Table.Th>{t("camera.snapshotUrl")}</Table.Th>
                                <Table.Th>{t("camera.livestreamUrl")}</Table.Th>
                                <Table.Th>{t("header.status")}</Table.Th>
                                { isAdmin &&
                                <Table.Th>{}</Table.Th>
                                }
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {camerasToDisplay.map((camera, index) => (
                                <Table.Tr key={index}>
                                    <Table.Td>{camera.name}</Table.Td>
                                    <Table.Td>{camera.location}</Table.Td>
                                    <Table.Td>{camera.resolution}</Table.Td>
                                    <Table.Td>{camera.modelNr}</Table.Td>
                                    <Table.Td>{camera.intervalSeconds}</Table.Td>

                                    {/* Snapshot URL Column with Scroll */}
                                    <Table.Td style={{ maxWidth: '200px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                        <Text>{camera.snapshotUrl}</Text>
                                    </Table.Td>

                                    {/* Livestream URL Column with Scroll */}
                                    <Table.Td style={{ maxWidth: '200px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                        <Text>{camera.livestreamUrl}</Text>
                                    </Table.Td>

                                    <Table.Td>
                                        <Flex justify='space-between' align='center'>
                                            <Badge
                                                color={camera.isActive ? "green.9" : "red.9"}
                                                variant="light"
                                                leftSection={camera.isActive ? <IconVideo size={16} /> : <IconVideoOff size={16} />}
                                            >
                                                {camera.isActive ? t("camera.active") : t("camera.inactive")}
                                            </Badge>

                                            <LogMessageModalButton resourceType={ResourceType.CAMERA} resourceId={camera.id}></LogMessageModalButton>
                                        </Flex>
                                    </Table.Td>
                                    {isAdmin &&
                                        <Table.Td>
                                            <Flex justify='center' align='center'>
                                                <IconEdit
                                                    color={"#199ff4"}
                                                    size={20}
                                                    stroke={2}
                                                    onClick={() => onClickEdit(camera)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </Flex>
                                        </Table.Td>
                                    }
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Box>
            ) : (
                <Text>{t("camera.noCamerasFound")}</Text>
            )}
        </Box>
    );
};
