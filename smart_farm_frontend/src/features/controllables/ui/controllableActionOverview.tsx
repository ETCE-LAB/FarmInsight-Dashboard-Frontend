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
    Modal,
    Loader
} from "@mantine/core";
import {executeTrigger} from "../useCase/executeTrigger";
import {updateControllableActionStatus, updateIsAutomated} from "../state/ControllableActionSlice";
import {getMyOrganizations} from "../../organization/useCase/getMyOrganizations";
import {useParams} from "react-router-dom";
import {showNotification} from "@mantine/notifications";
import {ControllableAction, getActionChain} from "../models/controllableAction";
import {getBackendTranslation, truncateText} from "../../../utils/utils";
import {ActionQueue} from "../models/actionQueue";
import {useInterval} from "@mantine/hooks";
import {fetchActionQueueEntry} from "../useCase/fetchActionQueueEntry";
import {getLogMessages} from "../../logMessages/useCase/getLogMessages";


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

const ControllableActionOverview: React.FC<{ fpfId: string }> = ({ fpfId }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const controllableActions = useSelector(
        (state: RootState) => state.controllableAction.controllableAction
    );
    const { organizationId } = useParams<{ organizationId: string }>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [groupLoading, setGroupLoading] = useState<Record<string, boolean>>({});
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        action?: ControllableAction;
        triggerId?: string;
        value?: string;
        isActive?: boolean;
    }>({ open: false });

    const [waitingOn, setWaitingOn] = useState<ActionQueue[]>([]);

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
            }).catch((error) => {
                showNotification({
                    title: t('common.loadingError'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [organizationId, t]);

    useInterval(async () => {
        if (waitingOn.length === 0) return;

        let done: string[] = []
        for (const entry of waitingOn) {
            // if dependsOn is not done yet, this one can't be either
            if (entry.dependsOn !== undefined && (waitingOn.some((e) => e.id === entry.dependsOn) && !done.includes(entry.dependsOn))) continue;
            try {
                const entryNow = await fetchActionQueueEntry(fpfId, entry.id);
                if (entryNow.endedAt) {
                    const logs = await getLogMessages('action', entry.actionId, undefined, entry.createdAt, undefined);
                    for (const log of logs) {
                        if (log.logLevel === 'debug') continue;
                        showNotification({
                            title: getBackendTranslation(controllableActions.find((e) => e.id === entry.actionId)?.name, i18n.language),
                            message: log.message,
                            color: log.logLevel === 'error' ? 'red' : 'green',
                        });
                    }
                    done.push(entry.id);
                }
            } catch(error) {
                done.push(entry.id);
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                });
            }
        }

        if (done.length > 0) {
            setWaitingOn(waitingOn.filter((e) => !done.includes(e.id)));
        }
    }, 1000, { autoInvoke: true });

    const handleTriggerChange = async (action: ControllableAction, triggerId: string, value: string, isActive: boolean) => {
        const hardwareId = action?.hardware?.id

        if (action && hardwareId) {
            setGroupLoading((prev) => ({ ...prev, [hardwareId]: true }));
        }

        try {
            if (triggerId === "auto") {
                setConfirmModal({ open: false });
                await executeTrigger(action.id, triggerId, "");
                dispatch(updateIsAutomated({ actionId: action.id, isAutomated: true }));
                dispatch(updateControllableActionStatus({ actionId: action.id, triggerId: "" }));
            } else {
                if (!isActive) {
                    setConfirmModal({ open: false });

                    const groupActions = controllableActions.filter(
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

                    if (activeManualAction && activeManualAction.id !== action.id) {
                        await executeTrigger(activeManualAction.id, "", "");
                        dispatch(updateIsAutomated({ actionId: activeManualAction.id, isAutomated: true }));
                        dispatch(updateControllableActionStatus({ actionId: activeManualAction.id, triggerId: "" }));
                    }

                    const queue_entries = await executeTrigger(action.id, triggerId, value);
                    setWaitingOn([...waitingOn, ...queue_entries]);
                    dispatch(updateIsAutomated({ actionId: action.id, isAutomated: false }));
                    dispatch(updateControllableActionStatus({ actionId: action.id, triggerId }));

                    showNotification({
                        title: `${getBackendTranslation(action.name, i18n.language)} ${t('controllableActionList.actionManuallyTriggered')}`,
                        message: t('controllableActionList.actionWaitingForResponse'),
                        color: 'green',
                    });
                }
            }
        } catch (error) {
            showNotification({
                title: t('common.executeError'),
                message: `${error}`,
                color: 'red',
            });
        }
        if (action && hardwareId) {
             setGroupLoading((prev) => ({ ...prev, [hardwareId]: false }));
        }
    };

    const groupedActions = controllableActions.reduce<Record<string, typeof controllableActions>>((acc, action) => {
        const key = action.hardware?.id ?? action.id;
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
                <>
                    {confirmModal.triggerId === "auto" &&
                        <Text>{t("controllableActionList.confirmAutoMessage")}</Text>
                    }

                    {confirmModal.triggerId !== "auto" && confirmModal.isActive === false && (() => {
                        const currentGroup = confirmModal.action?.hardware?.id ? groupedActions[confirmModal.action.hardware.id] : [];
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
                            return(
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
                            confirmModal.action &&
                            confirmModal.triggerId &&
                            confirmModal.value !== undefined &&
                            confirmModal.isActive !== undefined
                        ) {
                            handleTriggerChange(
                                confirmModal.action,
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
                                <Text fw={700} size="lg">{getBackendTranslation(actions[0].hardware?.name, i18n.language)}</Text>
                                {hasAutoInGroup && hasActiveManualInGroup && (
                                    <Button
                                        size="compact-xs"
                                        mt='5px'
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
                                                    action: activeManual,
                                                    triggerId: "auto",
                                                    value: "",
                                                    isActive: true
                                                });
                                            }
                                        }}
                                    >{t("controllableActionList.enableAutoMode")}</Button>
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
                                                    {truncateText(getBackendTranslation(action.name, i18n.language), 30)}
                                                    {getActionChain(action, controllableActions).map((a) => (
                                                        <>
                                                            &nbsp;&gt; {getBackendTranslation(a, i18n.language)}
                                                        </>
                                                    ))}
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
                                                                            action: action,
                                                                            triggerId: trigger.id,
                                                                            value: trigger.actionValue,
                                                                            isActive: isActiveThisTrigger
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                {trigger.actionValue.split(";").map((v, i) => (
                                                                    <>
                                                                        {i !== 0? " >" : ""} {v}
                                                                    </>
                                                                ))}
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
                                                                action: action,
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
