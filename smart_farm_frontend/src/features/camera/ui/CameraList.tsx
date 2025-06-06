import React, {useEffect, useState} from "react";
import {Badge, Box, Flex, Group, Modal, Table, Text, Title} from "@mantine/core";
import {DragDropContext, Draggable, DraggableProvided, Droppable} from '@hello-pangea/dnd';
import {IconCirclePlus, IconEdit, IconGripVertical, IconVideo, IconVideoOff} from "@tabler/icons-react";
import { Camera, EditCamera } from "../models/camera";
import { CameraForm } from "./CameraForm";
import { useTranslation } from "react-i18next";
import {ResourceType} from "../../logMessages/models/LogMessage";
import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";
import {moveArrayItem} from "../../../utils/utils";
import {postCameraOrder} from "../useCase/postCameraOrder";


export const CameraList: React.FC<{ camerasToDisplay?: Camera[], fpfId: string, isAdmin:Boolean }> = ({ camerasToDisplay, fpfId, isAdmin }) => {
    const [cameras, setCameras] = useState<Camera[] | undefined>(undefined);
    const [CameraModalOpen, setCameraModalOpen] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState<EditCamera | undefined>(undefined);
    const { t } = useTranslation();

    useEffect(() => {
        setCameras(camerasToDisplay);
    }, [camerasToDisplay]);

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
                <Title order={2}>{t('camera.cameras')}</Title>
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
            {cameras && cameras.length > 0 ? (
                <Table highlightOnHover withColumnBorders style={{ minWidth: "100%" }}>
                    <DragDropContext
                        onDragEnd={({ destination, source }) => {
                            const reordered: Camera[] = moveArrayItem(cameras, source.index, destination?.index || 0);
                            setCameras(reordered);
                            postCameraOrder(fpfId, reordered.map((x: Camera) => x.id)).then(() => {
                                // don't need to get list again since we keep the order locally
                            });
                        }}
                    >
                        <Table.Thead>
                            <Table.Tr>
                                {isAdmin && <Table.Th />}
                                <Table.Th>{t("header.name")}</Table.Th>
                                <Table.Th>{t("camera.location")}</Table.Th>
                                <Table.Th>{t("camera.resolution")}</Table.Th>
                                <Table.Th>{t("camera.modelNr")}</Table.Th>
                                <Table.Th>{t("camera.intervalSeconds")}</Table.Th>
                                <Table.Th>{t("camera.snapshotUrl")}</Table.Th>
                                <Table.Th>{t("camera.livestreamUrl")}</Table.Th>
                                <Table.Th>{t("header.status")}</Table.Th>
                                {isAdmin && <Table.Th />}
                            </Table.Tr>
                        </Table.Thead>
                        <Droppable droppableId="sensors" direction="vertical">
                            {(provided) => (
                                <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                                    {cameras.map((camera, index) => (
                                        <Draggable key={camera.id} index={index} draggableId={camera.id}>
                                            {(provided: DraggableProvided) => (
                                                <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
                                                    {isAdmin &&
                                                        <Table.Td>
                                                            <div {...provided.dragHandleProps}>
                                                                <IconGripVertical size={18} stroke={1.5} />
                                                            </div>
                                                        </Table.Td>
                                                    }
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
                                            )}
                                        </Draggable>

                                    ))}
                                    {provided.placeholder}
                                </Table.Tbody>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Table>
            ) : (
                <Text>{t("camera.noCamerasFound")}</Text>
            )}
        </Box>
    );
};
