import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../../utils/Hooks";
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
import {useParams} from "react-router-dom";
import {showNotification} from "@mantine/notifications";
import {ControllableAction} from "../models/controllableAction";
import {getBackendTranslation, truncateText} from "../../../utils/utils";

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

const ControllableActionOverview: React.FC<{ fpfId: string }> = () => {
    const { t, i18n } = useTranslation();

    const controllableAction = useSelector(
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

    //redux Store
    const myOrganizationsSelector = useAppSelector(state => state.organization.myOrganizations);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (organizationId && myOrganizationsSelector) {
            if (organizationId) {
                const org = myOrganizationsSelector.find((o) => o.id === organizationId);
                if (org) {
                    setIsAdmin(org.membership.role === 'admin');
                }
            } else {
                setIsAdmin(false);
            }
        }
    }, [organizationId, t, myOrganizationsSelector]);

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

                    if (activeManualAction && activeManualAction.id !== action.id) {
                        await executeTrigger(activeManualAction.id, "", "");
                        dispatch(updateIsAutomated({ actionId: activeManualAction.id, isAutomated: true }));
                        dispatch(updateControllableActionStatus({ actionId: activeManualAction.id, triggerId: "" }));
                    }

                    await executeTrigger(action.id, triggerId, value);
                    dispatch(updateIsAutomated({ actionId: action.id, isAutomated: false }));
                    dispatch(updateControllableActionStatus({ actionId: action.id, triggerId }));
                }
            }
            showNotification({
                title: t('common.executeSuccess'),
                message: '',
                color: 'green',
            });
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

    const groupedActions = controllableAction.reduce<Record<string, typeof controllableAction>>((acc, action) => {
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
                                    <Text c="red" size="sm">
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
                            ).then(() =>console.log("Trigger change executed"));
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
