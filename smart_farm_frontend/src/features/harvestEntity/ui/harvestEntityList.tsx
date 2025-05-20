import React, { useState } from "react";
import {
    Card,
    Modal,
    Table,
    Group,
    Button,
    Text,
    Flex,
    Paper,
    Grid, useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconCirclePlus,
    IconEdit,
    IconSquareRoundedMinus,
} from "@tabler/icons-react";
import { HarvestEntityForm } from "./harvestEntityForm";
import { HarvestEntity } from "../models/harvestEntity";
import { deleteHarvestEntity } from "../useCase/deleteHarvestEntity";
import { useAppDispatch } from "../../../utils/Hooks";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/store";
import { changedGrowingCycle, removeHarvestEntity } from "../../growthCycle/state/GrowingCycleSlice";
import { useAuth } from "react-oidc-context";

const truncateText = (text: string, limit: number): string => {
    if (text.length > limit) {
        return `${text.slice(0, limit)}...`;
    }
    return text;
};

const HarvestEntityList: React.FC<{ growingCycleID: string }> = ({ growingCycleID }) => {
    const theme = useMantineTheme();
    const [showHarvestEntityForm, setShowHarvestEntityForm] = useState(false);
    const { t } = useTranslation();
    const [toEditHarvestEntity, setToEditHarvestEntity] = useState<HarvestEntity | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<HarvestEntity | null>(null);
    const [selectedEntity, setSelectedEntity] = useState<HarvestEntity | null>(null);
    const auth = useAuth();
    const dispatch = useAppDispatch();
    const harvestEntities = useSelector((state: RootState) =>
        state.growingCycle.growingCycles.find(cycle => cycle.id === growingCycleID)?.harvests || []
    );

    const closeModal = () => {
        setShowHarvestEntityForm(false);
        setToEditHarvestEntity(null);
    };

    const handleDelete = (entity: HarvestEntity) => {
        setEntityToDelete(entity);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        if (entityToDelete) {
            deleteHarvestEntity(entityToDelete.id)
                .then((result) => {
                    if (result) {
                        dispatch(removeHarvestEntity({ cycleId: growingCycleID, harvestId: entityToDelete.id }));
                        dispatch(changedGrowingCycle());
                        showNotification({
                            title: "Success",
                            message: `Harvest entry for ${
                                entityToDelete.date ? new Date(entityToDelete.date).toLocaleDateString() : "unknown date"
                            } has been deleted successfully.`,
                            color: "green",
                        });
                    }
                })
                .catch(() => {
                    showNotification({
                        title: "Error",
                        message: "Failed to delete the harvest entry.",
                        color: "red",
                    });
                })
                .finally(() => {
                    setShowDeleteConfirmation(false);
                    setEntityToDelete(null);
                });
        }
    };

    return (
        <>
            {/* Modal for Adding/Editing Harvest Entities */}
            <Modal
                opened={showHarvestEntityForm}
                onClose={closeModal}
                title={toEditHarvestEntity ? "Edit Harvest Entry" : "Add Harvest Entry"}
                centered
            >
                <HarvestEntityForm
                    growingCycleId={growingCycleID}
                    toEditHarvestEntity={toEditHarvestEntity}
                    onSuccess={() => {
                        closeModal();
                        dispatch(changedGrowingCycle());
                        showNotification({
                            title: "Success",
                            message: toEditHarvestEntity
                                ? "Harvest entity updated successfully!"
                                : "Harvest entity added successfully!",
                            color: "green",
                        });
                    }}
                />
            </Modal>

            {/* Modal for Harvest Entity Details */}
            <Modal
                opened={!!selectedEntity}
                onClose={() => setSelectedEntity(null)}
                title={`Harvest Entry Details`}
                centered
            >
                {selectedEntity && (
                    <Paper style={{ width: "100%" }}>
                        <Grid>
                            <Grid.Col span={6}>
                                <Text size="sm">
                                    <strong>{t("header.table.date")}</strong>
                                </Text>
                                {selectedEntity.date ? new Date(selectedEntity.date).toLocaleDateString() : ""}
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Text size="sm">
                                    <strong>{t("header.table.amount")}</strong>
                                </Text>
                                <Text size="sm">{selectedEntity.amountInKg}</Text>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Text size="sm">
                                    <strong>{t("header.table.notes")}</strong>
                                </Text>
                                <Text size="sm">{selectedEntity.note || ""}</Text>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                )}
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal
                opened={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                title="Are you sure you want to delete this harvest entry?"
                centered
            >
                <Text style={{ fontSize: "14px", textAlign: "center", marginBottom: "1rem" }}>
                    {t("header.confirmDialog")}
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

            {/* Conditional Rendering: Only show harvest list if there are entries or if user is signed in (to add a harvest) */}
            {(harvestEntities.length > 0 || auth.user) && (
                <Card padding="md" radius="md" style={{ marginTop: "1rem", width: "100%" }}>
                    {harvestEntities.length > 0 ? (
                        <>
                            {auth.user && (
                                <IconCirclePlus
                                    size={25}
                                    onClick={() => {
                                        setToEditHarvestEntity(null);
                                        setShowHarvestEntityForm(true);
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        color: "#105385",
                                        marginBottom: "1rem",
                                    }}
                                />
                            )}
                            <Flex>
                                <Table striped highlightOnHover style={{ width: "100%" }}>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>{t("header.table.date")}</Table.Th>
                                            <Table.Th>{t("header.table.amount")}</Table.Th>
                                            <Table.Th>{t("header.table.notes")}</Table.Th>
                                            <Table.Th></Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {harvestEntities.map((entity) => (
                                            <Table.Tr key={entity.id}>
                                                <Table.Td
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setSelectedEntity(entity)}
                                                >
                                                    {entity.date ? new Date(entity.date).toLocaleDateString() : ""}
                                                </Table.Td>
                                                <Table.Td>{entity.amountInKg}</Table.Td>
                                                <Table.Td>{truncateText(entity.note, 12)}</Table.Td>
                                                {auth.user && (
                                                    <Table.Td>
                                                        <>
                                                            <IconSquareRoundedMinus
                                                                onClick={() => handleDelete(entity)}
                                                                size={20}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    marginRight: "0.5rem",
                                                                    color: "#a53737",
                                                                }}
                                                            />
                                                            <IconEdit
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowHarvestEntityForm(true);
                                                                    setToEditHarvestEntity(entity);
                                                                }}
                                                                size={20}
                                                                style={{ cursor: "pointer", color: "#105385" }}
                                                            />
                                                        </>
                                                </Table.Td>
                                                )}
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Flex>
                        </>
                    ) : (
                        // Harvest list is empty and user is signed in: show a button to add a harvest
                        auth.user && (
                            <Flex justify="center">
                                <Button
                                    onClick={() => {
                                        setToEditHarvestEntity(null);
                                        setShowHarvestEntityForm(true);
                                    }}
                                    variant='light'
                                    color={theme.colors.blue[6]}
                                >
                                    {t("Add Harvest")}
                                </Button>
                            </Flex>
                        )
                    )}
                </Card>
            )}
        </>
    );
};

export default HarvestEntityList;
