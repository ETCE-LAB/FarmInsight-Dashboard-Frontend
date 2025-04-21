import React, {useEffect, useState} from "react";
import { EditSensor, Sensor } from "../models/Sensor";
import {Badge, Box, Group, Modal, Table, Text, HoverCard, Flex} from "@mantine/core";
import { IconCirclePlus, IconEdit, } from "@tabler/icons-react";
import { SensorForm } from "./SensorForm";
import { useTranslation } from "react-i18next";
import {getBackendTranslation, getSensorStateColor} from "../../../utils/utils";
import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";
import {ResourceType} from "../../logMessages/models/LogMessage";
import {ThresholdList} from "../../threshold/ui/thresholdList";
import {Threshold} from "../../threshold/models/threshold";

export const SensorList: React.FC<{ sensorsToDisplay?: Sensor[], fpfId: string, isAdmin:Boolean }> = ({ sensorsToDisplay, fpfId, isAdmin }) => {
    const [sensorModalOpen, setSensorModalOpen] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState<EditSensor | undefined>(undefined);
    const { t, i18n } = useTranslation();

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

    const [selectedThresholds, setSelectedThresholds] = useState<Threshold[]>([]);
    const [selectedSensorId, setSelectedSensorId] = useState<string>('');
    const [thresholdModalOpen, setThresholdModalOpen] = useState(false);

    const onClickThresholds = (sensor:Sensor) => {
        setSelectedSensorId(sensor.id);
        setSelectedThresholds(sensor.thresholds);
        setThresholdModalOpen(true);
    }

    useEffect(() => {
        if (sensorsToDisplay && selectedSensorId !== '') {
            const sensor = sensorsToDisplay.filter((e) => e.id === selectedSensorId)[0];
            setSelectedThresholds(sensor.thresholds);
        }
    }, [sensorsToDisplay]);

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

            <Modal
                opened={thresholdModalOpen}
                onClose={() => setThresholdModalOpen(false)}
                title={t('threshold.title')}
                centered
                size="40%"
            >
                <ThresholdList sensorId={selectedSensorId} thresholds={selectedThresholds} />
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
                            <Table.Td>{sensor.name}</Table.Td>
                            <Table.Td>{sensor.location}</Table.Td>
                            <Table.Td>{sensor.modelNr}</Table.Td>
                            <Table.Td>{getBackendTranslation(sensor.parameter, i18n.language)}</Table.Td>
                            <Table.Td>{sensor.unit}</Table.Td>
                            <Table.Td>{sensor.intervalSeconds}</Table.Td>
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
                                        <IconEdit
                                            color={"green"}
                                            size={20}
                                            stroke={2}
                                            onClick={() => onClickThresholds(sensor)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Flex>
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
