import React, {useEffect, useState} from "react";
import {Hardware} from "../models/hardware";
import {
    Box,
    Group,
    Table,
    Title,
    Text,
    Modal,
    Flex,
    Button,
    HoverCard,
    HoverCardDropdown,
    HoverCardTarget
} from "@mantine/core";
import {DragDropContext, Draggable, DraggableProvided, Droppable} from '@hello-pangea/dnd';
import {IconCirclePlus, IconEdit, IconGripVertical, IconSquareRoundedMinus} from "@tabler/icons-react";
import {useTranslation} from "react-i18next";
import {getBackendTranslation, moveArrayItem} from "../../../utils/utils";
import {postHardwareOrder} from "../useCase/postHardwareOrder";
import {HardwareForm} from "./HardwareForm";
import {removeHardware} from "../useCase/removeHardware";
import {showNotification} from "@mantine/notifications";
import {useAppDispatch} from "../../../utils/Hooks";
import {createdFpf} from "../../fpf/state/FpfSlice";


export const HardwareList: React.FC<{ hardwareToDisplay?: Hardware[], fpfId: string, isAdmin:Boolean }> = ({ hardwareToDisplay, fpfId, isAdmin }) => {
    const [hardwares, setHardwares] = useState<Hardware[] | undefined>(undefined);
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedHardware, setSelectedHardware] = useState<Hardware | undefined>(undefined);
    const [hardwareToDelete, setHardwareToDelete] = useState<Hardware | undefined>(undefined);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

    useEffect(() => {
        if (hardwareToDisplay) setHardwares(hardwareToDisplay);
    }, [hardwareToDisplay]);

    const handleDelete = (hardware: Hardware) => {
        setHardwareToDelete(hardware);
        setConfirmationModalOpen(true);
    };

    const confirmDelete = () => {
        if (hardwareToDelete) {
            removeHardware(hardwareToDelete.id).then(() =>  {
                setHardwareToDelete(undefined);
                showNotification({
                    title: t('common.deleteSuccess'),
                    message: '',
                    color: "green",
                });
                setConfirmationModalOpen(false);
                dispatch(createdFpf());
            }).catch(() => {
                showNotification({
                    title: t('common.deleteError'),
                    message: '',
                    color: "red",
                });
            });
        }
    }

    return (
        <Box>
            <Modal
                opened={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                title={t("hardware.confirmDeletion")}
                centered
            >
                <Text style={{ fontSize: "14px", textAlign: "center", marginBottom: "1rem" }}>
                    {t("header.confirmDialog")}
                </Text>
                <Group gap="center" justify="center">
                    <Button color="red" onClick={confirmDelete}>
                        {t("header.yesDelete")}
                    </Button>
                    <Button variant="outline" onClick={() => setConfirmationModalOpen(false)}>
                        {t("header.cancel")}
                    </Button>
                </Group>
            </Modal>

            <Modal
                opened={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title={selectedHardware ? t("hardware.edit") : t("hardware.add")}
                centered
            >
                <HardwareForm toEditHardware={selectedHardware} fpfId={fpfId} close={() => setEditModalOpen(false)} />
            </Modal>


            <Group mb="md" justify="space-between">
                <Title order={2}>{t('hardware.title')}</Title>
                {isAdmin &&
                    <IconCirclePlus
                        size={25}
                        stroke={2}
                        color={"#199ff4"}
                        style={{ cursor: "pointer" }}
                        onClick={() => setEditModalOpen(true)}
                    />
                }
            </Group>

            {hardwares && hardwares.length > 0 ? (
                <Table highlightOnHover withColumnBorders style={{ minWidth: "100%" }}>
                    <DragDropContext
                        onDragEnd={({ destination, source }) => {
                            const reordered: Hardware[] = moveArrayItem(hardwares, source.index, destination?.index || 0);
                            setHardwares(reordered);
                            postHardwareOrder(fpfId, reordered.map((x: Hardware) => x.id)).then(() => {
                                // don't need to get list again since we keep the order locally
                            });
                        }}
                    >
                        <Table.Thead>
                            <Table.Tr>
                                {isAdmin && <Table.Th />}
                                <Table.Th>{t("header.name")}</Table.Th>
                                <Table.Th>{t("hardware.pingEndpointShort")}</Table.Th>
                                {isAdmin && <Table.Th />}
                            </Table.Tr>
                        </Table.Thead>
                        <Droppable droppableId="sensors" direction="vertical">
                            {(provided) => (
                                <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                                    {hardwares.map((hardware, index) => (
                                        <Draggable key={hardware.id} index={index} draggableId={hardware.id}>
                                            {(provided: DraggableProvided) => (
                                                <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
                                                    {isAdmin &&
                                                        <Table.Td>
                                                            <div {...provided.dragHandleProps}>
                                                                <IconGripVertical size={18} stroke={1.5} />
                                                            </div>
                                                        </Table.Td>
                                                    }
                                                    <Table.Td>{getBackendTranslation(hardware.name, i18n.language)}</Table.Td>
                                                    <Table.Td>{hardware.pingEndpoint}</Table.Td>
                                                    {isAdmin &&
                                                        <Table.Td>
                                                            <Flex justify='space-between'>
                                                                {hardware.canBeDeleted &&
                                                                    <IconSquareRoundedMinus
                                                                        onClick={() => handleDelete(hardware)}
                                                                        size={20}
                                                                        style={{ cursor: "pointer", color: "#a53737" }}
                                                                    />
                                                                }
                                                                {!hardware.canBeDeleted &&
                                                                    <HoverCard>
                                                                        <HoverCardTarget>
                                                                            <IconSquareRoundedMinus
                                                                                size={20}
                                                                                style={{ color: "grey" }}
                                                                            />
                                                                        </HoverCardTarget>
                                                                        <HoverCardDropdown>
                                                                            <Text size="sm">{t('hardware.canNotDeleteHint')}</Text>
                                                                        </HoverCardDropdown>
                                                                    </HoverCard>
                                                                }
                                                                <IconEdit
                                                                    onClick={() => {
                                                                        setEditModalOpen(true);
                                                                        setSelectedHardware(hardware);
                                                                    }}
                                                                    size={20}
                                                                    style={{ cursor: "pointer", color: "#199ff4" }}
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
                <Text>{t('hardware.notFound')}</Text>
            )}
        </Box>
    );
}