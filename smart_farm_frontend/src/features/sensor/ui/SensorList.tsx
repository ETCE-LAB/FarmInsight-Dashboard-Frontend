import React, { useState } from "react";
import { EditSensor, Sensor } from "../models/Sensor";
import { Badge, Box, Group, Modal, Table, Text, HoverCard } from "@mantine/core";
import { IconCirclePlus, IconEdit, IconMobiledata, IconMobiledataOff, } from "@tabler/icons-react";
import { SensorForm } from "./SensorForm";
import { useTranslation } from "react-i18next";
import { getSensorStateColor } from "../../../utils/utils";
import {LogMessageList} from "../../logMessages/ui/LogMessageList";

export const SensorList: React.FC<{ sensorsToDisplay?: Sensor[], fpfId: string, isAdmin:Boolean }> = ({ sensorsToDisplay, fpfId, isAdmin }) => {
    const [sensorModalOpen, setSensorModalOpen] = useState(false);
    const [logMessageModalOpen, setLogMessageModalOpen] = useState(false);
    const [logMessageSensorId, setLogMessageSensorId] = useState("");
    const [selectedSensor, setSelectedSensor] = useState<EditSensor | undefined>(undefined);
    const { t } = useTranslation();

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

    return (
        <Box>
            {/* Add Sensor Modal */}
            <Modal
                opened={sensorModalOpen}
                onClose={() => setSensorModalOpen(false)}
                title={selectedSensor ? t("sensor.addSensor") : t("sensor.editSensor")}
                centered
                size="40%"
            >
                <SensorForm toEditSensor={selectedSensor} setClosed={setSensorModalOpen} />
            </Modal>

            {/* Add Log Message Modal */}
            <Modal
                opened={logMessageModalOpen}
                onClose={() => setLogMessageModalOpen(false)}
                title={t("log.logListTitle") }
                centered
                size="40%"
            >
                <LogMessageList resourceType='sensor' resourceId={logMessageSensorId} />
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
            {/* Conditional Rendering of Table */}
            {sensorsToDisplay && sensorsToDisplay.length > 0 ? (
                <Table highlightOnHover withColumnBorders>
                    <Table.Thead>
                    <Table.Tr>
                        <Table.Th></Table.Th>
                        <Table.Th>{t('sensorList.name')}</Table.Th>
                        <Table.Th>{t('sensorList.location')}</Table.Th>
                        <Table.Th>{t('sensorList.modelNr')}</Table.Th>
                        <Table.Th>{t('sensorList.parameter')}</Table.Th>
                        <Table.Th>{t('sensorList.unit')}</Table.Th>
                        <Table.Th>{t('sensorList.intervalSeconds')}</Table.Th>
                        <Table.Th>{t('header.status')}</Table.Th>
                        {isAdmin &&
                        <Table.Th>{}</Table.Th>
                        }
                    </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                    {sensorsToDisplay.map((sensor, index) => (
                        <Table.Tr key={index}>
                            <Table.Td>
                                <HoverCard>
                                    <HoverCard.Target>
                                        <Badge color={getSensorStateColor(sensor)} style={{ cursor: "pointer" }} onClick={() => {setLogMessageSensorId(sensor.id); setLogMessageModalOpen(true);}}></Badge>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Text size="sm">
                                            {`last value: ${new Date(sensor.lastMeasurement.measuredAt)}`}
                                        </Text>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            </Table.Td>
                            <Table.Td>{sensor.name}</Table.Td>
                            <Table.Td>{sensor.location}</Table.Td>
                            <Table.Td>{sensor.modelNr}</Table.Td>
                            <Table.Td>{sensor.parameter}</Table.Td>
                            <Table.Td>{sensor.unit}</Table.Td>
                            <Table.Td>{sensor.intervalSeconds}</Table.Td>
                            <Table.Td>
                                <Badge
                                    color={sensor.isActive ? "green.9" : "red.9"}
                                    variant="light"
                                    leftSection={sensor.isActive ? <IconMobiledata size={16} /> : <IconMobiledataOff size={16} />}
                                >
                                    {sensor.isActive ? t("camera.active") : t("camera.inactive")}
                                </Badge>
                            </Table.Td>
                            {isAdmin &&
                                <Table.Td style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Group>
                                        <IconEdit
                                            color={"#199ff4"}
                                            size={20}
                                            stroke={2}
                                            onClick={() => onClickEdit(sensor)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Group>
                                </Table.Td>
                            }
                        </Table.Tr>
                    ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <Text>{t("sensor.noSensorsFound")}</Text>
            )}
        </Box>
    );
};
