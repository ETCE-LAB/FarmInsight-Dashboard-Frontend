import React, {useState} from "react";
import {Threshold} from "../models/threshold";
import {Modal, Table} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconCirclePlus, IconEdit, IconSquareRoundedMinus} from "@tabler/icons-react";
import {showNotification} from "@mantine/notifications";
import {receivedSensor} from "../../sensor/state/SensorSlice";
import {deleteThreshold} from "../useCase/deleteThreshold";
import {useAppDispatch} from "../../../utils/Hooks";
import {ThresholdForm} from "./thresholdForm";

export const ThresholdList: React.FC<{ sensorId: string, thresholds: Threshold[] }> = ({ sensorId, thresholds }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [editThresholdModalOpen, setEditThresholdModalOpen] = useState(false);
    const [toEditThreshold, setToEditThreshold] = useState<Threshold | null>(null);

    const handleDelete = (threshold: Threshold)=> {
        deleteThreshold(threshold.id).then(() => {
            dispatch(receivedSensor());
        }).catch((error) => {
            showNotification({
                title: t('common.deleteError'),
                message: `${error}`,
                color: "red",
            });
        });
    }

    return (
        <>
            <Modal
                opened={editThresholdModalOpen}
                onClose={() => setEditThresholdModalOpen(false)}  // Close modal when canceled
                title={toEditThreshold ? t('threshold.editTitle') : t('threshold.addTitle')}
                centered
            >
                <ThresholdForm sensorId={sensorId} toEditThreshold={toEditThreshold} onSuccess={() => setEditThresholdModalOpen(false)} />
            </Modal>
            <Table highlightOnHover withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>{t('threshold.description')}</Table.Th>
                        <Table.Th>{t('threshold.lowerBound')}</Table.Th>
                        <Table.Th>{t('threshold.upperBound')}</Table.Th>
                        <Table.Th>{t('threshold.color')}</Table.Th>
                        <Table.Th>
                            <IconCirclePlus
                                size={25}
                                stroke={2}
                                color={"#199ff4"}
                                onClick={() => {
                                    setToEditThreshold(null);
                                    setEditThresholdModalOpen(true);
                                }}
                                style={{ cursor: "pointer" }}
                            />
                        </Table.Th>
                        <Table.Th/>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {thresholds && thresholds.map((threshold, index) => (
                        <Table.Tr key={index}>
                            <Table.Td>{threshold.description}</Table.Td>
                            <Table.Td>{threshold.lowerBound}</Table.Td>
                            <Table.Td>{threshold.upperBound}</Table.Td>
                            <Table.Td>{threshold.color}</Table.Td>
                            <Table.Td>
                                <IconEdit
                                    color={"#199ff4"}
                                    size={20}
                                    stroke={2}
                                    onClick={() => {
                                        setToEditThreshold(threshold);
                                        setEditThresholdModalOpen(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                            </Table.Td>
                            <Table.Td>
                                <IconSquareRoundedMinus
                                    onClick={() => handleDelete(threshold)}
                                    size={20}
                                    style={{
                                        cursor: "pointer",
                                        marginRight: "0.5rem",
                                        color: "#a53737",
                                    }}
                                />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    )
}