import React, {useEffect, useState} from "react";
import { EditSensor, Sensor } from "../models/Sensor";
import {Badge, Box, Group, Modal, Table, Text, HoverCard, Flex, Button, Card} from "@mantine/core";
import {DragDropContext, Draggable, DraggableProvided, Droppable} from '@hello-pangea/dnd';
import {IconChevronDown, IconChevronLeft, IconCirclePlus, IconEdit, IconGripVertical } from "@tabler/icons-react";
import { SensorForm } from "./SensorForm";
import { useTranslation } from "react-i18next";
import {getBackendTranslation, getSensorStateColor, moveArrayItem} from "../../../utils/utils";
import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";
import {ResourceType} from "../../logMessages/models/LogMessage";
import {ThresholdList} from "../../threshold/ui/thresholdList";
import {postSensorOrder} from "../useCase/postSensorOrder";

export const SensorList: React.FC<{ sensorsToDisplay?: Sensor[], fpfId: string, isAdmin:Boolean }> = ({ sensorsToDisplay, fpfId, isAdmin }) => {
    const [sensors, setSensors] = useState<Sensor[] | undefined>(undefined);
    const [sensorModalOpen, setSensorModalOpen] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState<EditSensor | undefined>(undefined);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setSensors(sensorsToDisplay);
    }, [sensorsToDisplay]);

    const onClickEdit = (sensor: Sensor) => {
        const editSensor: EditSensor = {
            id: sensor.id,
            name: sensor.name,
            unit: sensor.unit,
            parameter: sensor.parameter,
            location: sensor.location,
            modelNr: sensor.modelNr,
            intervalSeconds: sensor.intervalSeconds,
            isActive: sensor.isActive,
            fpfId,
            aggregate: sensor.aggregate,
            hardwareConfiguration: {
                sensorClassId: "",
                additionalInformation: {},
            }
        };

        setSelectedSensor(editSensor);
        setSensorModalOpen(true);
    }

    const onClickAddSensor = () => {
        setSelectedSensor(undefined);
        setSensorModalOpen(true);
    }

    const SensorRow: React.FC<{sensor: Sensor, provided: DraggableProvided}> = ({ sensor, provided }) => {
        const [open, setOpen] = useState<boolean>(false);

        return (
            <>
                <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
                    {isAdmin &&
                        <Table.Td>
                            <div {...provided.dragHandleProps}>
                                <IconGripVertical size={18} stroke={1.5} />
                            </div>
                        </Table.Td>
                    }
                    <Table.Td>{sensor.name}</Table.Td>
                    <Table.Td>{sensor.location}</Table.Td>
                    <Table.Td>{sensor.modelNr}</Table.Td>
                    <Table.Td>{getBackendTranslation(sensor.parameter, i18n.language)}</Table.Td>
                    <Table.Td>{sensor.unit}</Table.Td>
                    <Table.Td>{sensor.intervalSeconds}</Table.Td>
                    <Table.Td>{sensor.aggregate ? t("common.activated"): t("common.inactive")}</Table.Td>
                    <Table.Td>
                        <Flex justify='space-between' align='center'>
                            <HoverCard>
                                <HoverCard.Target>
                                    <Badge color={getSensorStateColor(new Date(sensor.lastMeasurement.measuredAt), sensor.isActive, sensor.intervalSeconds)}>
                                        {!sensor.isActive && (<>{t("camera.inactive")}</>)}
                                    </Badge>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size="sm">
                                        {`last value: ${new Date(sensor.lastMeasurement.measuredAt).toLocaleString(navigator.language)}`}
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                            <LogMessageModalButton resourceType={ResourceType.SENSOR} resourceId={sensor.id}></LogMessageModalButton>
                        </Flex>
                    </Table.Td>
                    <Table.Td>
                        <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <IconChevronDown size={16} /> : <IconChevronLeft size={16} />}
                        </Button>
                    </Table.Td>
                    {isAdmin &&
                        <Table.Td>
                            <Flex justify='center' align='center'>
                                <IconEdit
                                    color={"#199ff4"}
                                    size={20}
                                    stroke={2}
                                    onClick={() => onClickEdit(sensor)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Flex>
                        </Table.Td>
                    }
                </Table.Tr>
                {open &&
                    <Table.Tr>
                        <Table.Td colSpan={isAdmin ? 9 : 8} >
                            <Card withBorder shadow="sm" p="sm">
                                <ThresholdList sensorId={sensor.id} thresholds={sensor.thresholds} />
                            </Card>
                        </Table.Td>
                    </Table.Tr>
                }
            </>
        )
    }

    return (
        <Box>
            {/* Add Sensor Modal */}
            <Modal
                opened={sensorModalOpen}
                onClose={() => setSensorModalOpen(false)}
                title={!selectedSensor ? t("sensor.addSensor") : t("sensor.editSensor")}
                centered
                size="40%"
            >
                <SensorForm toEditSensor={selectedSensor} setClosed={setSensorModalOpen} />
            </Modal>

            {/* Header with Add Button */}
            <Group mb="md" justify="space-between">
                <h2>{t('sensor.title')}</h2>
                {isAdmin &&
                <IconCirclePlus
                    size={25}
                    stroke={2}
                    color={"#199ff4"}
                    onClick={() => onClickAddSensor()}
                    style={{ cursor: "pointer" }}
                />
                }
            </Group>
            {sensors && sensors.length > 0 ? (
                <Table highlightOnHover withColumnBorders>
                    <DragDropContext
                        onDragEnd={({ destination, source }) => {
                            const sensors_: Sensor[] = moveArrayItem(sensors, source.index, destination?.index || 0);
                            setSensors(sensors_);
                            postSensorOrder(fpfId, sensors_.map((x: Sensor) => x.id)).then(() => {
                                // don't need to get list again since we keep the order locally
                            });
                        }}
                    >
                        <Table.Thead>
                        <Table.Tr>
                            {isAdmin && <Table.Th />}
                            <Table.Th>{t('sensorList.name')}</Table.Th>
                            <Table.Th>{t('sensorList.location')}</Table.Th>
                            <Table.Th>{t('sensorList.modelNr')}</Table.Th>
                            <Table.Th>{t('sensorList.parameter')}</Table.Th>
                            <Table.Th>{t('sensorList.unit')}</Table.Th>
                            <Table.Th>{t('sensorList.intervalSeconds')}</Table.Th>
                            <Table.Th>{t('sensorList.aggregate')}</Table.Th>
                            <Table.Th>{t('header.status')}</Table.Th>
                            <Table.Th>{t('threshold.title')}</Table.Th>
                            {isAdmin && <Table.Th />}
                        </Table.Tr>
                        </Table.Thead>
                        <Droppable droppableId="sensors" direction="vertical">
                            {(provided) => (
                                <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                                    {sensors?.map((sensor, index) => (
                                        <Draggable key={sensor.id} index={index} draggableId={sensor.id}>
                                            {(provided: DraggableProvided) => (
                                                <SensorRow sensor={sensor} provided={provided}></SensorRow>
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
                <Text>{t("sensor.noSensorsFound")}</Text>
            )}
        </Box>
    );
};
