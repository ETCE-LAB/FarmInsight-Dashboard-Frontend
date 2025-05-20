import React, {useState} from "react";
import {Badge, Box, Group, Modal, Table, Text, Flex, Card, Button} from "@mantine/core";
import {IconChevronDown, IconChevronRight, IconCirclePlus, IconEdit} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";
import {ControllableAction} from "../models/controllableAction";
import {ActionTrigger} from "../models/actionTrigger";
import {ControllableActionForm} from "./controllableActionForm";
import {ActionTriggerForm} from "./actionTriggerForm";
import {updateControllableActionStatus, updateIsAutomated} from "../state/ControllableActionSlice";
import {executeTrigger} from "../useCase/executeTrigger";
import {useAppDispatch} from "../../../utils/Hooks";

export const ControllableActionList: React.FC<{ isAdmin:Boolean }> = (isAdmin) => {
    const { t } = useTranslation();
    const controllableAction = useSelector((state: RootState) => state.controllableAction.controllableAction);

    const dispatch = useAppDispatch();
    const [controllableActionModalOpen, setControllableActionModalOpen] = useState(false);
    const [actionTriggerModalOpen, setActionTriggerModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ControllableAction | undefined>(undefined);
    const [selectedTrigger, setSelectedTrigger] = useState<ActionTrigger | undefined>(undefined);
    const [selectedActionId, setSelectedActionId] = useState<string>("");
    const [expandedRows, setExpandedRows] = useState<string[]>([]);

    const [confirmModal, setConfirmModal] = useState<{
        open: boolean,
        actionId?: string,
        triggerId?: string,
        value?: string,
        isActive?: boolean
    }>({open: false});


    const toggleRow = (id: string) => {
      setExpandedRows((prev) =>
        prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
      );
    };

    const onClickEdit = (action: ControllableAction) => {
        const editAction: ControllableAction = {
            id: action.id,
            name: action.name,
            actionClassId: action.actionClassId,
            isActive: action.isActive,
            maximumDurationSeconds: action.maximumDurationSeconds,
            additionalInformation: action.additionalInformation,
            hardware: action.hardware,
            trigger: action.trigger,
            isAutomated: action.isAutomated,
            actionScriptName: action.actionScriptName,
            status: action.status
        };

        setSelectedAction(editAction);
        setControllableActionModalOpen(true);
    }

    const onClickAddAction = () => {
        setSelectedAction(undefined);
        setControllableActionModalOpen(true);
    }
    const onClickAddTrigger = (id:string) => {
        setSelectedActionId(id);
        setSelectedTrigger(undefined);
        setActionTriggerModalOpen(true);
    }

    const onClickEditTrigger = (trigger: ActionTrigger) => {
        const editTrigger: ActionTrigger = {
            id:                 trigger.id,
            isActive:           trigger.isActive,
            actionId:           trigger.actionId,
            triggerLogic:       trigger.triggerLogic,
            description:        trigger.description,
            actionValue:        trigger.actionValue,
            type:               trigger.type,
            actionValueType:    trigger.actionValueType

        }

        setSelectedTrigger(editTrigger)
        setActionTriggerModalOpen(true)
    }

    const handleTriggerChange = async (actionId: string, triggerId: string, value: string, isActive:boolean) => {
        try {
            if( triggerId==="auto")
            {
                setConfirmModal({open: false});
                dispatch(updateIsAutomated({actionId: actionId, isAutomated: true}));
                dispatch(updateControllableActionStatus({actionId, triggerId: ""}));
                await executeTrigger(actionId, triggerId, "");
            }
            else{
                if(!isActive){
                    setConfirmModal({open: false});
                    dispatch(updateIsAutomated({ actionId: actionId, isAutomated: false }));
                    dispatch(updateControllableActionStatus({ actionId, triggerId }));
                    await executeTrigger(actionId, triggerId, value);
                }
                else{
                    setConfirmModal({open: false});
                    dispatch(updateIsAutomated({actionId: actionId, isAutomated: true}));
                    dispatch(updateControllableActionStatus({ actionId: actionId, triggerId: "" }));
                    await executeTrigger(actionId, triggerId, value);
                }
            }

        } catch (error) {
            console.error("Failed to execute trigger", error);
        }
    };

    const groupedActions = controllableAction.reduce<Record<string, typeof controllableAction>>((acc, action) => {
      const key = action.hardware?.id ?? 'unassigned';
      if (!acc[key]) acc[key] = [];
      acc[key].push(action);
      return acc;
    }, {});

    return (
        <Box>
            {/* Add Controllable Action Modal */}
            <Modal
                opened={controllableActionModalOpen}
                onClose={() => setControllableActionModalOpen(false)}
                title={!selectedAction ? t("controllableActionList.addAction") : t("controllableActionList.editAction")}
                centered
                size="40%"
            >
                <ControllableActionForm toEditAction={selectedAction} setClosed={setControllableActionModalOpen} />
            </Modal>

            {/* Add Action Trigger Modal */}
            <Modal
                opened={actionTriggerModalOpen}
                onClose={() => setActionTriggerModalOpen(false)}
                title={!selectedTrigger ? t("controllableActionList.trigger.addAction") : t("controllableActionList.trigger.editAction")}
                centered
                size="70%"
            >
                <ActionTriggerForm actionId={selectedActionId} toEditTrigger={selectedTrigger} setClosed={setActionTriggerModalOpen} />
            </Modal>

            <Modal
                opened={confirmModal.open}
                onClose={() => setConfirmModal({open: false})}
                title={t("controllableActionList.confirmTitle")}
            >
                <Text>{t("controllableActionList.confirmMessage")}</Text>
                <Flex justify="flex-end" gap="md" mt="md">
                    <Button variant="light" onClick={() => setConfirmModal({open: false})}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={() => {
                        console.log(confirmModal.actionId , confirmModal.triggerId , confirmModal.value , confirmModal.isActive)
                        if (confirmModal.actionId && confirmModal.triggerId && confirmModal.value !== undefined && confirmModal.isActive !== undefined) {
                            handleTriggerChange(confirmModal.actionId, confirmModal.triggerId, confirmModal.value, confirmModal.isActive);
                        }
                    }}>
                        {t("common.confirm")}
                    </Button>
                </Flex>
            </Modal>

            {/* Header with Add Button */}
            <Group mb="md" justify="space-between">
                <h2>{t('controllableActionList.title')}</h2>
                {isAdmin &&
                <IconCirclePlus
                    size={25}
                    stroke={2}
                    color={"#199ff4"}
                    onClick={() => onClickAddAction()}
                    style={{ cursor: "pointer" }}
                />
                }
            </Group>
            {/* Conditional Rendering of Table */}
            {controllableAction && controllableAction.length > 0 ? (
                <>
                <Table striped highlightOnHover withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th />
                      <Table.Th>{t("controllableActionList.name")}</Table.Th>
                      <Table.Th>{t("controllableActionList.isActive")}</Table.Th>
                      <Table.Th>{t("controllableActionList.actionScriptName")}</Table.Th>
                      <Table.Th>{t("controllableActionList.maximumDurationSeconds")}</Table.Th>
                      <Table.Th>{t("controllableActionList.hardware")}</Table.Th>
                      {isAdmin && <Table.Th />}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {Object.entries(groupedActions).map(([hardwareId, actions]) => (
                        actions.map((action) => {
                        const hasActiveManualInGroup = actions.some((a) =>
                          a.trigger.some(
                            (t) => t.type === "manual" && t.isActive && t.id === a.status && !a.isAutomated
                          )
                        );
                        return (
                        <React.Fragment key={action.id}>
                            {/* Main Row */}
                            <Table.Tr>
                                <Table.Td>
                                    <Button
                                        variant="subtle"
                                        size="xs"
                                        onClick={() => toggleRow(action.id)}
                                    >
                                        {expandedRows.includes(action.id) ? <IconChevronDown size={16}/> :
                                            <IconChevronRight size={16}/>}
                                    </Button>
                                </Table.Td>
                                <Table.Td>{action.name}</Table.Td>
                                <Table.Td>
                                    <Flex justify="center" align="center">
                                        <Badge color={action.isActive ? "green" : "gray"}>
                                            {action.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </Flex>
                                </Table.Td>
                                <Table.Td>{action.actionScriptName}</Table.Td>
                                <Table.Td>{action.maximumDurationSeconds}</Table.Td>
                                <Table.Td>{action.hardware?.name}</Table.Td>
                                {isAdmin && (
                                    <Table.Td>
                                        <Flex justify="center" align="center">
                                            <IconEdit
                                                color={"#199ff4"}
                                                size={20}
                                                stroke={2}
                                                onClick={() => onClickEdit(action)}
                                                style={{cursor: "pointer"}}
                                            />
                                        </Flex>
                                    </Table.Td>
                                )}
                            </Table.Tr>

                            {/* Expanded Row */}
                            {expandedRows.includes(action.id) && (
                                <Table.Tr>
                                    <Table.Td colSpan={isAdmin ? 7 : 6}>
                                        <Card withBorder shadow="sm" p="sm">
                                            <Group justify="space-between" mb="xs">
                                                <Text fw={500}>{t("controllableActionList.triggerTitle")}</Text>
                                                {isAdmin && (
                                                    <IconCirclePlus
                                                        size={20}
                                                        stroke={2}
                                                        color="#199ff4"
                                                        onClick={() => onClickAddTrigger(action.id)}
                                                        style={{cursor: "pointer"}}
                                                    />
                                                )}
                                            </Group>

                                            <Table striped highlightOnHover withColumnBorders>
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th>{t("controllableActionList.trigger.active")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.type")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.valueType")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.value")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.triggerLogic")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.status")}</Table.Th>
                                                        {isAdmin && <Table.Th/>}
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>
                                                    {action.trigger.map((trigger) => {
                                                        const isActive = (trigger.id === action.status && !action.isAutomated) || (trigger.type !== 'manual' && action.isAutomated);
                                                        return(
                                                            <Table.Tr key={trigger.id}>
                                                                <Table.Td>
                                                                    <Button
                                                                        size="xs"
                                                                        variant={isActive ? "filled" : "light"}
                                                                        color={isActive ? "blue" : "gray"}
                                                                        radius="xl"
                                                                        style={!isAdmin ? {
                                                                            pointerEvents: "none",
                                                                            opacity: 0.6
                                                                        } : undefined}
                                                                        disabled={hasActiveManualInGroup && trigger.type !== 'manual'}
                                                                        onClick={() => setConfirmModal({
                                                                            open: true,
                                                                            actionId: action.id,
                                                                            triggerId: trigger.type !== 'manual' ? "auto" : trigger.id,
                                                                            value: trigger.type !== 'manual' ? "" : trigger.actionValue,
                                                                            isActive: isActive
                                                                        })}
                                                                    >{isActive ? t("controllableActionList.trigger.running") : t("controllableActionList.trigger.inactive")}
                                                                    </Button>
                                                                </Table.Td>
                                                                <Table.Td>{trigger.type}</Table.Td>
                                                                <Table.Td>{trigger.actionValueType}</Table.Td>
                                                                <Table.Td>{trigger.actionValue}</Table.Td>
                                                                <Table.Td>{trigger.triggerLogic}</Table.Td>
                                                                <Table.Td>
                                                                    <Flex justify="center" align="center">
                                                                        <Badge color={trigger.isActive ? "green" : "gray"}>
                                                                            {trigger.isActive ? "Active" : "Inactive"}
                                                                        </Badge>
                                                                    </Flex>
                                                                </Table.Td>
                                                                {isAdmin && (
                                                                    <Table.Td>
                                                                        <Flex justify="center" align="center">
                                                                            <IconEdit
                                                                                color={"#199ff4"}
                                                                                size={20}
                                                                                stroke={2}
                                                                                onClick={() => onClickEditTrigger(trigger)}
                                                                                style={{cursor: "pointer"}}
                                                                            />
                                                                        </Flex>
                                                                    </Table.Td>
                                                                )}
                                                            </Table.Tr>
                                                        )
                                                    })}
                                                </Table.Tbody>
                                            </Table>
                                        </Card>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </React.Fragment>
                        )
                    })))}
                  </Table.Tbody>
                </Table>


                </>
            ) : (
                <Text>{t("sensor.noSensorsFound")}</Text>
            )}
        </Box>
    );
};
