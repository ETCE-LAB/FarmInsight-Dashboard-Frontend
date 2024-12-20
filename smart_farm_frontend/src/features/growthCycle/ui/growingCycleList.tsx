import React, { useState, useEffect } from "react";
import {
    Card,
    Modal,
    Table,
    Notification,
    Group,
    Button,
    Text,
    Flex,
    Paper,
    Grid,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconCircleMinus, IconCirclePlus, IconEdit, IconSeeding } from "@tabler/icons-react";
import { GrowingCycleForm } from "./growingCycleForm";
import { GrowingCycle } from "../models/growingCycle";
import { deleteGrowingCycle } from "../useCase/deleteGrowingCycle";
import { changedGrowingCycle } from "../state/GrowingCycleSlice";
import { useAppDispatch } from "../../../utils/Hooks";
import {showNotification} from "@mantine/notifications";

// Helper function to truncate text
const truncateText = (text: string, limit: number): string => {
    if (text.length > limit) {
        return `${text.slice(0, limit)}...`;
    }
    return text;
};

const GrowingCycleList: React.FC<{ fpfId: string; growingCycles: GrowingCycle[] }> = ({ fpfId, growingCycles }) => {
    const [showGrowingCycleForm, setShowGrowingCycleForm] = useState(false);
    const { t, i18n } = useTranslation();
    const [toEditGrowingCycle, setToEditGrowingCycle] = useState<GrowingCycle | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [cycleToDelete, setCycleToDelete] = useState<GrowingCycle | null>(null); // State to hold cycle to delete
    const [selectedCycle, setSelectedCycle] = useState<GrowingCycle | null>(null); // State for the details modal

    const dispatch = useAppDispatch();


    const closeModal = () => {
        setShowGrowingCycleForm(false);
        setToEditGrowingCycle(null);
    };

    const handleDelete = (cycle: GrowingCycle) => {
        setCycleToDelete(cycle);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        if (cycleToDelete) {
            deleteGrowingCycle(cycleToDelete.id)
                .then((result) => {
                    console.log(result)
                    if(result){
                        dispatch(changedGrowingCycle());
                        showNotification({
                            title: 'Success',
                            message: `Growing cycle for ${cycleToDelete.plants} has been deleted successfully.`,
                            color: 'green',
                        });
                    }else{
                        showNotification({
                        title: 'Error',
                        message: 'Failed to delete the growing cycle',
                        color: 'red',
                    });
                    }
                })
                .catch(() => {
                    showNotification({
                        title: 'Error',
                        message: 'Failed to delete the growing cycle',
                        color: 'red',
                    });
                })
                .finally(() => {
                    setShowDeleteConfirmation(false);
                    setCycleToDelete(null);
                });
        }
    };

    return (
        <>
            {/* Modal for Adding Growing Cycles */}
            <Modal
                opened={showGrowingCycleForm}
                onClose={closeModal}
                title={toEditGrowingCycle ? "Edit Growing Cycle" : "Add Growing Cycle"}
            >
                <GrowingCycleForm
                    fpfId={fpfId}
                    toEditGrowingCycle={toEditGrowingCycle}
                    onSuccess={(message, color) => {
                        closeModal();
                    }}
                />
            </Modal>

            {/* Modal for Growing Cycle Details */}
            <Modal
                opened={!!selectedCycle}
                onClose={() => setSelectedCycle(null)}
                title={`Growing Cycle Details for ${selectedCycle?.plants}`}
                centered
            >
                {selectedCycle && (
                    <Paper style={{ width: "100%" }}>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm"><strong>Plant:</strong></Text>
                                <Text size="sm">{selectedCycle.plants}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm"><strong>Planted:</strong></Text>
                                <Text size="sm">{selectedCycle.startDate ? new Date(selectedCycle.startDate).toLocaleDateString() : "N/A"}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm"><strong>Harvested:</strong></Text>
                                <Text size="sm">{selectedCycle.endDate ? new Date(selectedCycle.endDate).toLocaleDateString() : "Still growing"}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm"><strong>Notes:</strong></Text>
                                <Text size="sm">{selectedCycle.note || "No notes available."}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                )}
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal
                opened={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                title="Are you sure you want to delete this growing cycle?"
                centered
            >
                <Text style={{ fontSize: "14px", textAlign: "center", marginBottom: "1rem" }}>
                    {t("headers.confirmDialog")}
                </Text>
                <Group gap="center" justify={"center"}>
                    <Button color="red" onClick={confirmDelete}>
                        {t("header.yesDelete")}
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
                        {t("header.cancel")}
                    </Button>
                </Group>
            </Modal>

            {/* Card Component */}
            <Card
                shadow="sm"
                padding="md"
                radius="md"
                style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)", position: "static", overflowY:'scroll', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', height:'45vh'}}
            >
                <IconCirclePlus
                    size={25}
                    onClick={() => setShowGrowingCycleForm(true)}
                    style={{
                        cursor: "pointer",
                        color: "#105385",
                        position: "relative",
                        top: "25px",
                        left: "10px",
                    }}
                />
                <Flex>
                    <Table striped highlightOnHover
                        style={{
                            textAlign: "left",
                            borderCollapse: "collapse",
                            width: "100%",
                        }}
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th></Table.Th>
                                <Table.Th>{t('header.table.name')}</Table.Th>
                                <Table.Th>{t('header.table.planted')}</Table.Th>
                                <Table.Th>{t('header.table.harvested')}</Table.Th>
                                <Table.Th>{t('header.table.notes')}</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {growingCycles.map((cycle) => (
                                <Table.Tr key={cycle.id}>
                                    <Table.Td>
                                        <IconSeeding
                                            style={{
                                                marginRight: "0.5rem",
                                                color: cycle.endDate ? "grey" : "green",
                                            }}
                                        />
                                    </Table.Td>
                                    <Table.Td
                                        style={{ fontWeight: "normal", cursor: "pointer" }}
                                        onClick={() => setSelectedCycle(cycle)}
                                    >
                                        {truncateText(cycle.plants, 12)}
                                    </Table.Td>
                                    <Table.Td>{cycle.startDate ? new Date(cycle.startDate).toLocaleDateString() : ""}</Table.Td>
                                    <Table.Td>{cycle.endDate ? new Date(cycle.endDate).toLocaleDateString() : ""}</Table.Td>
                                    <Table.Td>{cycle.note ? truncateText(cycle.note, 12) : ""}</Table.Td>
                                    <Table.Td>
                                        <IconCircleMinus
                                            onClick={() => handleDelete(cycle)}
                                            size={20}
                                            style={{ cursor: "pointer", color: "darkred" }}
                                        />
                                        <IconEdit
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering row click
                                                setShowGrowingCycleForm(true);
                                                setToEditGrowingCycle(cycle);
                                            }}
                                            size={20}
                                            style={{ cursor: "pointer", color: "#105385", marginLeft: "1rem" }}
                                        />
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Flex>
            </Card>
        </>
    );
};

export default GrowingCycleList;
