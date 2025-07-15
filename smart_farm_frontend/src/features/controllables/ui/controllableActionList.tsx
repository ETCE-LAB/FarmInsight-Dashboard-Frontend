import React, {useState} from "react";
import {Badge, Box, Group, Modal, Table, Text, Flex, Card, Button, Title} from "@mantine/core";
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
import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";
import {showNotification} from "@mantine/notifications";


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
            actionValueType:    trigger.actionValueType,
            lastTriggered: null
        }

        setSelectedTrigger(editTrigger)
        setActionTriggerModalOpen(true)
    }

    const handleTriggerChange = (actionId: string, triggerId: string, value: string, isActive: boolean) => {
        setConfirmModal({open: false});
        dispatch(updateIsAutomated({actionId: actionId, isAutomated: isActive || triggerId === "auto"}));
        dispatch(updateControllableActionStatus({actionId, triggerId: triggerId !== "auto" && !isActive ? triggerId : ""}));

        executeTrigger(actionId, triggerId, value).then((v) => {
            showNotification({
                title: t('common.executeSuccess'),
                message: '',
                color: 'green',
            });
        }).catch((error) => {
            showNotification({
                title: t('common.executeError'),
                message: `${error}`,
                color: 'red',
            });
        });
    };

    const groupedActions = controllableAction.reduce<Record<string, typeof controllableAction>>((acc, action) => {
      const key = action.hardware?.id ?? action.id;
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
                onClose={() => setConfirmModal({ open: false })}
                title={t("controllableActionList.confirmTitle")}
            >
                <>
                    {confirmModal.triggerId === "auto" && (() => {
                        return (
                            <Text>{t("controllableActionList.confirmAutoMessage")}</Text>
                        );
                    })}

                    {confirmModal.triggerId !== "auto" && confirmModal.isActive === false && (() => {
                        const currentAction = controllableAction.find(a => a.id === confirmModal.actionId);
                        const currentGroup = currentAction?.hardware?.id ? groupedActions[currentAction.hardware.id] : [];

                        const autoTriggersInGroup = currentGroup?.some(action =>
                            action.trigger.some(t => t.type !== "manual" && t.isActive)
                        );

                        if (autoTriggersInGroup) {
                            return (
                                <>
                                    <Text>{t("controllableActionList.confirmMessage")}</Text>
                                    <Text color="red" size="sm">
                                        ⚠ {t("controllableActionList.manualDisablesAutoWarning")}
                                    </Text>
                                </>
                            );
                        } else {
                            return (
                                <Text>{t("controllableActionList.confirmMessage")}</Text>
                            )
                        }

                    })}
                </>
                <Flex justify="flex-end" gap="md" mt="md">
                    <Button variant="light" onClick={() => setConfirmModal({ open: false })}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={() => {
                        if (
                            confirmModal.actionId &&
                            confirmModal.triggerId &&
                            confirmModal.value !== undefined &&
                            confirmModal.isActive !== undefined
                        ) {
                            handleTriggerChange(
                                confirmModal.actionId,
                                confirmModal.triggerId,
                                confirmModal.value,
                                confirmModal.isActive
                            );
                        }
                    }}>
                        {t("common.confirm")}
                    </Button>
                </Flex>
            </Modal>

            {/* Header with Add Button */}
            <Group mb="md" justify="space-between">
                <Title order={2}>{t('controllableActionList.title')}</Title>
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
                        <Table.Th>{t('log.logListTitleShort')}</Table.Th>
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
                        const hasAutoInGroup = actions.some((a) => a.trigger.some((t) => t.type !== "manual"));

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
                                <Table.Td><LogMessageModalButton resourceType='action' resourceId={action.id} /></Table.Td>
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

                                            {hasAutoInGroup && hasActiveManualInGroup && (
                                                <Group justify="flex-start" mt="5px">
                                                    <Button
                                                        size="compact-xs"
                                                        onClick={() => {
                                                            const activeManual = actions.find((a) =>
                                                                a.trigger.some(
                                                                    (t) =>
                                                                        t.type === "manual" &&
                                                                        t.isActive &&
                                                                        t.id === a.status &&
                                                                        !a.isAutomated
                                                                )
                                                            );
                                                            if (activeManual) {
                                                                setConfirmModal({
                                                                    open: true,
                                                                    actionId: activeManual.id,
                                                                    triggerId: "auto",
                                                                    value: "",
                                                                    isActive: true
                                                                });
                                                            }
                                                        }}
                                                    >{t("controllableActionList.enableAutoMode")}</Button>
                                                </Group>
                                            )}

                                            <Table striped highlightOnHover withColumnBorders>
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th>{t("controllableActionList.trigger.status")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.type")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.valueType")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.value")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.description")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.triggerLogic")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.status")}</Table.Th>
                                                        <Table.Th>{t("controllableActionList.trigger.lastTriggered")}</Table.Th>
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
                                                                <Table.Td>{trigger.description}</Table.Td>
                                                                <Table.Td>{trigger.triggerLogic}</Table.Td>
                                                                <Table.Td>
                                                                    <Flex justify="space-between" align="center">
                                                                        <Badge color={isActive ? "blue" : trigger.isActive ? "green" : "gray"}>
                                                                            {isActive ? t("controllableActionList.trigger.running") :trigger.isActive ? t("controllableActionList.trigger.active") : t("controllableActionList.trigger.inactive")}
                                                                        </Badge>
                                                                    </Flex>
                                                                </Table.Td>
                                                                <Table.Td>{trigger.lastTriggered && new Date(trigger.lastTriggered).toLocaleString(navigator.language)}</Table.Td>
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
                <Text>{t("controllableActionList.noActionFound")}</Text>
            )}
        </Box>
    );
};
