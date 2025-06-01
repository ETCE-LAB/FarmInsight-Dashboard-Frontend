import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../../utils/Hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";
import {lowerFirst} from "@mantine/hooks";
import {
    Badge,
    Button,
    Card,
    Flex,
    Text,
    Modal, Switch, Loader
} from "@mantine/core";
import {executeTrigger} from "../useCase/executeTrigger";
import {updateControllableActionStatus, updateIsAutomated} from "../state/ControllableActionSlice";
import {getMyOrganizations} from "../../organization/useCase/getMyOrganizations";
import {useParams} from "react-router-dom";

const getColor = (value: string) => {
    switch (lowerFirst(value)) {
        case 'on':
            return 'green';
        case 'off':
            return 'red';
        case 'auto':
        default:
            return 'blue';
    }
};

const truncateText = (text: string, limit: number): string =>
    text.length > limit ? `${text.slice(0, limit)}...` : text;

const ControllableActionOverview: React.FC<{ fpfId: string }> = () => {
    const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const controllableAction = useSelector(
    (state: RootState) => state.controllableAction.controllableAction
  );
  const { organizationId } = useParams<{ organizationId: string }>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [groupLoading, setGroupLoading] = useState<Record<string, boolean>>({});
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    actionId?: string;
    triggerId?: string;
    value?: string;
    isActive?: boolean;
  }>({ open: false });

    useEffect(() => {
        if (organizationId) {
            getMyOrganizations().then((organizations) => {
                let found = false;
                if(organizations.length > 0) {
                    organizations.forEach((org: any) => {
                        if (org.id === organizationId) {
                            setIsAdmin(org.membership.role === 'admin');
                            found = true;
                        }
                    });
                }
                if (!found) {
                    setIsAdmin(false);
                }
            });
        }
    }, [organizationId]);


    const handleTriggerChange = async (
        actionId: string,
        triggerId: string,
        value: string,
        isActive: boolean
    ) => {
        const clickedAction = controllableAction.find((a) => a.id === actionId);
        const hardwareId = clickedAction?.hardware?.id;

        if (clickedAction && hardwareId) {
            setGroupLoading((prev) => ({ ...prev, [hardwareId]: true }));
        }

        try {
            if (triggerId === "auto") {
                setConfirmModal({ open: false });
                await executeTrigger(actionId, triggerId, "");
                dispatch(updateIsAutomated({ actionId, isAutomated: true }));
                dispatch(updateControllableActionStatus({ actionId, triggerId: "" }));
            } else {
                if (!isActive) {
                    setConfirmModal({ open: false });

                    const groupActions = controllableAction.filter(
                        (a) => a.hardware?.id === hardwareId
                    );

                    const activeManualAction = groupActions.find(
                        (a) =>
                            a.trigger.some(
                                (t) =>
                                    t.type === "manual" &&
                                    t.id === a.status &&
                                    t.isActive &&
                                    !a.isAutomated
                            )
                    );

                    if (activeManualAction && activeManualAction.id !== actionId) {
                        await executeTrigger(activeManualAction.id, "", "");
                        dispatch(updateIsAutomated({ actionId: activeManualAction.id, isAutomated: true }));
                        dispatch(updateControllableActionStatus({ actionId: activeManualAction.id, triggerId: "" }));
                    }

                    await executeTrigger(actionId, triggerId, value);
                    dispatch(updateIsAutomated({ actionId, isAutomated: false }));
                    dispatch(updateControllableActionStatus({ actionId, triggerId }));
                }
            }
        } catch (error) {
            console.error("Failed to execute trigger", error);
        }
        if (clickedAction && hardwareId) {
             setGroupLoading((prev) => ({ ...prev, [hardwareId]: false }));
        }

    };

    const groupedActions = controllableAction.reduce<Record<string, typeof controllableAction>>((acc, action) => {
        const key = action.hardware?.id ?? "unassigned";
        if (!acc[key]) acc[key] = [];
        acc[key].push(action);
        return acc;
    }, {});

    return (
        <Card radius="md" padding="md">
            <Modal
                opened={confirmModal.open}
                onClose={() => setConfirmModal({ open: false })}
                title={t("controllableActionList.confirmTitle")}
            >
                <Text>{t("controllableActionList.confirmMessage")}</Text>

                {confirmModal.triggerId !== "auto" && confirmModal.isActive === false && (() => {
                    const currentAction = controllableAction.find(a => a.id === confirmModal.actionId);
                  const currentGroup = currentAction?.hardware?.id
                    ? groupedActions[currentAction.hardware.id]
                    : [];

                  const autoTriggersInGroup = currentGroup?.some(action =>
                    action.trigger.some(t => t.type !== "manual" && t.isActive)
                  );

                    if (autoTriggersInGroup) {
                        return (
                            <Text color="red" size="sm">
                                ⚠ {t("controllableActionList.manualDisablesAutoWarning")}
                            </Text>
                        );
                    }

                    return null;
                })()}

                <Flex justify="flex-end" gap="md" mt="md">
                    <Button variant="light" onClick={() => setConfirmModal({ open: false })}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={() => {
                        console.log(confirmModal)
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

            {!isAdmin && (
                <Badge
                    color="gray"
                    variant="light"
                    size="sm"
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 10,
                        pointerEvents: "none"
                    }}
                >
                    Read only
                </Badge>
            )}

            <Flex direction="column" gap="sm" style={{ overflowX: "auto", marginTop: 5 }}>
                {Object.entries(groupedActions).map(([hardwareId, actions]) => {
                    const hasActiveManualInGroup = actions.some((a) =>
                        a.trigger.some((t) => t.type === "manual" && t.isActive && t.id === a.status && !a.isAutomated)
                    );
                    const hasAutoInGroup = actions.some((a) => a.trigger.some((t) => t.type !== "manual"));

                    return (
                        <Card key={hardwareId} shadow="sm" p="md" withBorder>
                            {hasAutoInGroup && hasActiveManualInGroup && (
                                <Badge
                                    color="red"
                                    variant="light"
                                    size="sm"
                                    style={{
                                        position: "absolute",
                                        top: 5,
                                        right: 5,
                                        zIndex: 10,
                                    }}
                                >
                                    {t("controllableActionList.autoDisabledNote")}
                                </Badge>
                            )}

                            <Flex justify="space-between" align="center" mb="sm" style={{ overflowX: "auto", marginTop: 5 }}>
                                <Text fw={700} size="lg">{actions[0].hardware?.name}</Text>
                                {hasAutoInGroup && hasActiveManualInGroup && (
                                    <Switch
                                        size="sm"
                                        label={t("controllableActionList.enableAutoMode")}
                                        checked={!hasActiveManualInGroup}
                                        onChange={() => {
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
                                    />
                                )}
                            </Flex>

                            {groupLoading[hardwareId] && (
                                <Flex justify="center" my="sm" style={{
                                    position: "absolute",
                                    top: "45%",
                                    right: "45%",
                                    zIndex: 10,
                                    pointerEvents: "none",
                                }}>
                                    <Loader size="sm" />
                                </Flex>
                            )}

                            <Flex direction="column" gap="sm">
                                {actions.map((action) => {
                                    const manualTriggers = action.trigger.filter((t) => t.type === "manual" && t.isActive);
                                    const hasAuto = action.trigger.some((t) => t.type !== "manual" && t.isActive);

                                    return (
                                        <Card key={action.id} p="sm" shadow="none" style={
                                            groupLoading[hardwareId] ? {
                                                opacity: 0.0,
                                                pointerEvents: "none",
                                                transition: "opacity 0.0s ease"
                                            } : undefined
                                        }>
                                            <Flex align="center" justify="space-between" gap="md" wrap="nowrap">
                                                <Text fw={600} tt="capitalize" style={{ whiteSpace: "nowrap", minWidth: 150 }}>
                                                    {truncateText(action.name, 30)}
                                                </Text>

                                                <Flex direction="row" gap="xs" align="center" wrap="wrap">
                                                    {manualTriggers.map((trigger) => {
                                                        const isActiveThisTrigger =
                                                            trigger.id === action.status && !action.isAutomated;

                                                        return (
                                                            <Button
                                                                key={trigger.id}
                                                                size="xs"
                                                                style={!isAdmin ? { pointerEvents: "none", opacity: 0.6 } : undefined}
                                                                variant={isActiveThisTrigger ? "filled" : "light"}
                                                                color={isActiveThisTrigger ? getColor(trigger.actionValue) : "gray"}
                                                                radius="xl"
                                                                onClick={() => {
                                                                    if (!isActiveThisTrigger) {
                                                                        setConfirmModal({
                                                                            open: true,
                                                                            actionId: action.id,
                                                                            triggerId: trigger.id,
                                                                            value: trigger.actionValue,
                                                                            isActive: isActiveThisTrigger
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                {trigger.actionValue}
                                                            </Button>
                                                        );
                                                    })}

                                                    {hasAuto && (
                                                        <Button
                                                            size="xs"
                                                            variant={action.isAutomated ? "filled" : "light"}
                                                            color={action.isAutomated ? "blue" : "gray"}
                                                            radius="xl"
                                                            style={!isAdmin ? { pointerEvents: "none", opacity: 0.6 } : undefined}
                                                            disabled={hasActiveManualInGroup}
                                                            onClick={() => setConfirmModal({
                                                                open: true,
                                                                actionId: action.id,
                                                                triggerId: "auto",
                                                                value: "",
                                                                isActive: true
                                                            })}
                                                        >
                                                            {t("controllableActionList.auto")}
                                                        </Button>
                                                    )}
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    );
                                })}
                            </Flex>
                        </Card>
                    );
                })}
            </Flex>
        </Card>
    );
};

export default ControllableActionOverview;
