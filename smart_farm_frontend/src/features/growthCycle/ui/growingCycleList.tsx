import React, { useState } from "react";
import { Card, Modal, Table, Group, Button, Text, Flex, Paper, Grid } from "@mantine/core";
import {DragDropContext, Draggable, DraggableProvided, Droppable} from '@hello-pangea/dnd';
import { useTranslation } from "react-i18next";
import { IconCirclePlus, IconEdit, IconSeeding, IconInfoSquareRounded, IconSquareRoundedMinus } from "@tabler/icons-react";
import { GrowingCycleForm } from "./growingCycleForm";
import { GrowingCycle } from "../models/growingCycle";
import { removeGrowingCycle } from "../useCase/removeGrowingCycle";
import {changedGrowingCycle, deleteGrowingCycle, setGrowingCycles} from "../state/GrowingCycleSlice";
import { useAppDispatch } from "../../../utils/Hooks";
import HarvestEntityList from "../../harvestEntity/ui/harvestEntityList";
import { HarvestEntityForm } from "../../harvestEntity/ui/harvestEntityForm";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/store";
import { useAuth } from "react-oidc-context";
import { useMediaQuery } from "@mantine/hooks";
import { moveArrayItem, truncateText } from "../../../utils/utils";
import { postGrowingCycleOrder } from "../useCase/postGrowingCycleOrder";


const formatTotalHarvest = (cycle: GrowingCycle): string => {
    const totalHarvest =
        cycle.harvests?.reduce((sum, harvest) => sum + harvest.amountInKg, 0) || 0;
    if (totalHarvest < 1) {
        return `${(totalHarvest * 1000).toFixed(2)} g`;
    }
    return `${totalHarvest.toFixed(2)} kg`;
};

const GrowingCycleList: React.FC<{ fpfId: string, isAdmin: boolean }> = ({ fpfId, isAdmin }) => {
    const [activeModal, setActiveModal] = useState<
        "growingCycleForm" | "harvestForm" | "details" | "deleteConfirmation" | null
    >(null);
    const [toEditGrowingCycle, setToEditGrowingCycle] = useState<GrowingCycle | null>(null);
    const [cycleToDelete, setCycleToDelete] = useState<GrowingCycle | null>(null);
    const [selectedCycle, setSelectedCycle] = useState<GrowingCycle | null>(null);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const growingCycles = useSelector((state: RootState) => state.growingCycle.growingCycles);
    const auth = useAuth();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const closeAllModals = () => {
        setActiveModal(null);
        setToEditGrowingCycle(null);
        setCycleToDelete(null);
        setSelectedCycle(null);
    };

    const handleDelete = (cycle: GrowingCycle) => {
        setCycleToDelete(cycle);
        setActiveModal("deleteConfirmation");
    };

    const confirmDelete = () => {
        if (cycleToDelete) {
            removeGrowingCycle(cycleToDelete.id).then((result) => {
                dispatch(deleteGrowingCycle(cycleToDelete.id));
                dispatch(changedGrowingCycle());
                showNotification({
                    title: t('common.deleteSuccess'),
                    message: '',
                    color: "green",
                });
                closeAllModals();
            }).catch((error) => {
                showNotification({
                    title: t('common.deleteError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    };

    return (
        <>
            {/* Growing Cycle Form Modal */}
            <Modal
                opened={activeModal === "growingCycleForm"}
                onClose={closeAllModals}
                centered
                title={toEditGrowingCycle ? "Edit Growing Cycle" : "Add Growing Cycle"}
            >
                <GrowingCycleForm
                    fpfId={fpfId}
                    toEditGrowingCycle={toEditGrowingCycle}
                    closeForm={closeAllModals}
                />
            </Modal>

            {/* Harvest Entity Form Modal */}
            <Modal
                opened={activeModal === "harvestForm"}
                onClose={() => setActiveModal("details")}
                title={t("harvestEntityForm.addHarvest")}
                centered
            >
                {selectedCycle && (
                    <HarvestEntityForm
                        growingCycleId={selectedCycle.id}
                        toEditHarvestEntity={null}
                        onSuccess={() => { setActiveModal("details"); }}
                    />
                )}
            </Modal>

            {/* Details Modal */}
            <Modal
                opened={activeModal === "details"}
                onClose={closeAllModals}
                title={`${t("header.table.details")} ${selectedCycle?.plants}`}
                centered
            >
                {selectedCycle && (
                    <>
                        <Paper>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Text size="sm">
                                        <strong>{t("header.table.name")}</strong>
                                    </Text>
                                    <Text size="sm">{selectedCycle.plants}</Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="sm">
                                        <strong>{t("header.table.planted")}</strong>
                                    </Text>
                                    <Text size="sm">
                                        {selectedCycle.startDate
                                            ? new Date(selectedCycle.startDate).toLocaleDateString()
                                            : "N/A"}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="sm">
                                        <strong>{t("header.table.notes")}</strong>
                                    </Text>
                                    <Text size="sm">{selectedCycle.note || t('growingCycleForm.noNotes')}</Text>
                                </Grid.Col>
                            </Grid>
                        </Paper>
                        {selectedCycle.harvests && <HarvestEntityList growingCycleID={selectedCycle.id} />}
                    </>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={activeModal === "deleteConfirmation"}
                onClose={closeAllModals}
                title={t("growingCycleForm.confirmDeletion")}
                centered
            >
                <Text style={{ fontSize: "14px", textAlign: "center", marginBottom: "1rem" }}>
                    {t("header.confirmDialog")}
                </Text>
                <Group gap="center" justify="center">
                    <Button color="red" onClick={confirmDelete}>
                        {t("header.yesDelete")}
                    </Button>
                    <Button variant="outline" onClick={closeAllModals}>
                        {t("header.cancel")}
                    </Button>
                </Group>
            </Modal>

            {/* Main Content */}
            <Card radius="md" padding="md">
                {auth.user && (
                    <IconCirclePlus
                        size={25}
                        onClick={() => {
                            setActiveModal("growingCycleForm");
                            setToEditGrowingCycle(null);
                        }}
                        style={{
                            cursor: "pointer",
                            color: "#105385",
                            marginBottom: "1rem",
                        }}
                    />
                )}

                {isMobile ? (
                    // Mobile-friendly vertical list
                    <Flex direction="column" gap="sm" mt="md">
                        {growingCycles.map((cycle) => (
                            <Card key={cycle.id} p="sm" withBorder>
                                <Text fw={600} ta="center" mb="xs" tt="capitalize">
                                    {truncateText(cycle.plants, 20)}
                                </Text>
                                <Flex justify="space-around" align="center" mb="xs">
                                    {auth.user && (
                                        <>
                                            <IconSquareRoundedMinus
                                                onClick={() => handleDelete(cycle)}
                                                size={20}
                                                style={{ cursor: "pointer", color: "#a53737" }}
                                            />
                                            <IconEdit
                                                onClick={() => {
                                                    setActiveModal("growingCycleForm");
                                                    setToEditGrowingCycle(cycle);
                                                }}
                                                size={20}
                                                style={{ cursor: "pointer", color: "#105385" }}
                                            />
                                        </>
                                    )}
                                    <IconInfoSquareRounded
                                        onClick={() => {
                                            setSelectedCycle(cycle);
                                            setActiveModal("details");
                                        }}
                                        size={20}
                                        style={{ cursor: "pointer", color: "#2D6A4F" }}
                                    />
                                </Flex>
                                <Text size="xs" c="dimmed">
                                    {t("header.table.planted")}:{" "}
                                    {cycle.startDate ? new Date(cycle.startDate).toLocaleDateString() : ""}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {t("growingCycleForm.totalHarvestAmount")}: {formatTotalHarvest(cycle)}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {t("header.table.notes")}: {cycle.note ? truncateText(cycle.note, 20) : ""}
                                </Text>
                            </Card>
                        ))}
                    </Flex>
                ) : (
                    // Desktop table view
                    <Flex style={{ overflowX: "auto" }}>
                        <Table striped highlightOnHover style={{ width: "100%", tableLayout: "fixed" }}>
                            <DragDropContext
                                onDragEnd={({ destination, source }) => {
                                    const reordered: GrowingCycle[] = moveArrayItem(growingCycles, source.index, destination?.index || 0);
                                    dispatch(setGrowingCycles(reordered));
                                    postGrowingCycleOrder(fpfId, reordered.map((x: GrowingCycle) => x.id)).then(() => {
                                        // don't need to get list again since we keep the order locally
                                    });
                                }}
                            >
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th style={{ width: "5%" }} />
                                        <Table.Th style={{ width: "25%" }}>{t("header.table.name")}</Table.Th>
                                        <Table.Th style={{ width: "20%" }}>{t("header.table.planted")}</Table.Th>
                                        <Table.Th style={{ width: "20%" }}>{t("growingCycleForm.totalHarvestAmount")}</Table.Th>
                                        <Table.Th style={{ width: "20%" }}>{t("header.table.notes")}</Table.Th>
                                        {auth.user && <Table.Th style={{ width: "10%" }} />}
                                        {auth.user && <Table.Th style={{ width: "10%" }} />}
                                    </Table.Tr>
                                </Table.Thead>
                                <Droppable droppableId="sensors" direction="vertical">
                                    {(provided) => (
                                        <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                                            {growingCycles.map((cycle, index) => (
                                                <Draggable key={cycle.id} index={index} draggableId={cycle.id}>
                                                    {(provided: DraggableProvided) => (
                                                        <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
                                                            <Table.Td>
                                                                {isAdmin &&
                                                                    <Table.Td>
                                                                        <div {...provided.dragHandleProps}>
                                                                            <IconSeeding style={{ marginRight: "0.5rem", color: "green" }} />
                                                                        </div>
                                                                    </Table.Td>
                                                                }
                                                                {!isAdmin &&
                                                                    <IconSeeding style={{ marginRight: "0.5rem", color: "green" }} />
                                                                }
                                                            </Table.Td>
                                                            <Table.Td>{truncateText(cycle.plants, 12)}</Table.Td>
                                                            <Table.Td>
                                                                {cycle.startDate ? new Date(cycle.startDate).toLocaleDateString() : ""}
                                                            </Table.Td>
                                                            <Table.Td>{formatTotalHarvest(cycle)}</Table.Td>
                                                            <Table.Td>{cycle.note ? truncateText(cycle.note, 12) : ""}</Table.Td>
                                                            {auth.user && (
                                                                <Table.Td>
                                                                    <IconSquareRoundedMinus
                                                                        onClick={() => handleDelete(cycle)}
                                                                        size={25}
                                                                        style={{ cursor: "pointer", color: "#a53737", marginRight: "1rem" }}
                                                                    />
                                                                    <IconEdit
                                                                        onClick={() => {
                                                                            setActiveModal("growingCycleForm");
                                                                            setToEditGrowingCycle(cycle);
                                                                        }}
                                                                        size={25}
                                                                        style={{ cursor: "pointer", color: "#105385" }}
                                                                    />
                                                                </Table.Td>
                                                            )}
                                                            <Table.Td>
                                                                <IconInfoSquareRounded
                                                                    onClick={() => {
                                                                        setSelectedCycle(cycle);
                                                                        setActiveModal("details");
                                                                    }}
                                                                    size={25}
                                                                    style={{ cursor: "pointer", color: "#2D6A4F" }}
                                                                />
                                                            </Table.Td>
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
                    </Flex>
                )}
            </Card>
        </>
    );
};

export default GrowingCycleList;
