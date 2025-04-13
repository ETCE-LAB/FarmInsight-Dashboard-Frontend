import React, {useState} from "react";
import {Threshold} from "../models/threshold";
import {Modal, Table} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconCirclePlus, IconEdit} from "@tabler/icons-react";
import {ThresholdForm} from "./thresholdForm";

export const ThresholdList: React.FC<{ sensorId: string, thresholds: Threshold[] }> = ({ sensorId, thresholds }) => {
    const { t } = useTranslation();
    const [editThresholdModalOpen, setEditThresholdModalOpen] = useState(false);
    const [toEditThreshold, setToEditThreshold] = useState<Threshold | null>(null);

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
            <Table withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>{t('threshold.lowerBound')}</Table.Th>
                        <Table.Th>{t('threshold.upperBound')}</Table.Th>
                        <Table.Th>{t('threshold.color')}</Table.Th>
                        <Table.Th>{t('threshold.description')}</Table.Th>
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
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {thresholds && thresholds.map((threshold, index) => (
                        <Table.Tr key={index}>
                            <Table.Td>{threshold.lowerBound}</Table.Td>
                            <Table.Td>{threshold.upperBound}</Table.Td>
                            <Table.Td>{threshold.color}</Table.Td>
                            <Table.Td>{threshold.description}</Table.Td>
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
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    )
}