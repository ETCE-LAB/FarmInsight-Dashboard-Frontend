import React, {useEffect, useState} from "react";
import {Hardware} from "../models/hardware";
import {Box, Group, Table, Title, Text} from "@mantine/core";
import {DragDropContext, Draggable, DraggableProvided, Droppable} from '@hello-pangea/dnd';
import {IconCirclePlus, IconEdit, IconGripVertical} from "@tabler/icons-react";
import {useTranslation} from "react-i18next";
import {Camera} from "../../camera/models/camera";
import {moveArrayItem} from "../../../utils/utils";
import {postHardwareOrder} from "../useCase/postHardwareOrder";

export const HardwareList: React.FC<{ hardwareToDisplay?: Hardware[], fpfId: string, isAdmin:Boolean }> = ({ hardwareToDisplay, fpfId, isAdmin }) => {
    const [hardwares, setHardwares] = useState<Hardware[] | undefined>(undefined);
    const { t } = useTranslation();

    useEffect(() => {
        if (hardwareToDisplay) setHardwares(hardwareToDisplay);
    }, [hardwareToDisplay]);

    return (
        <Box>
            <Group mb="md" justify="space-between">
                <Title order={2}>{t('hardware.title')}</Title>
                {isAdmin &&
                    <IconCirclePlus
                        size={25}
                        stroke={2}
                        color={"#199ff4"}
                        style={{ cursor: "pointer" }}
                    />
                }
            </Group>

            {hardwares && hardwares.length > 0 ? (
                <Table highlightOnHover withColumnBorders style={{ minWidth: "100%" }}>
                    <DragDropContext
                        onDragEnd={({ destination, source }) => {
                            const reordered: Camera[] = moveArrayItem(hardwares, source.index, destination?.index || 0);
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
                                                    <Table.Td>{hardware.name}</Table.Td>
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