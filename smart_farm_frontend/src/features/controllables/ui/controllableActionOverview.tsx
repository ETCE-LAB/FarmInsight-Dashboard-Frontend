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
    Modal
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
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const controllableAction = useSelector((state: RootState) => state.controllableAction.controllableAction);
    const {organizationId} = useParams<{ organizationId: string }>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean,
        actionId?: string,
        triggerId?: string,
        value?: string,
        isActive?: boolean
    }>({open: false});

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

    const handleTriggerChange = async (actionId: string, triggerId: string, value: string, isActive:boolean) => {
        try {
            if (triggerId==="auto")
            {
                setConfirmModal({open: false});
                dispatch(updateIsAutomated({actionId: actionId, isAutomated: true}));
                dispatch(updateControllableActionStatus({actionId, triggerId: ""}));
                await executeTrigger(actionId, triggerId, "");
            }
            else{
                if (!isActive){
                    setConfirmModal({open: false});
                    dispatch(updateIsAutomated({ actionId: actionId, isAutomated: false }));
                    dispatch(updateControllableActionStatus({ actionId, triggerId }));
                    await executeTrigger(actionId, triggerId, value);
                }
                else{ // Disable the manual action by setting it to isAutomated (without an auto trigger available)
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
        <Card radius="md" padding="md">
            <Modal
                opened={confirmModal.open}
                onClose={() => setConfirmModal({open: false})}
                title={t("controllableActionList.confirmTitle")}
            >
                <Text>{t("controllableActionList.confirmMessage")}</Text>

                {confirmModal.triggerId !== "auto" && confirmModal.isActive === false && (() => {
                  // Check if any auto triggers are active in the same group (excluding current action)
                  const currentGroup = groupedActions[controllableAction.find(a => a.id === confirmModal.actionId)?.hardware?.id ?? ''];
                  const autoTriggersInGroup = currentGroup?.some(action =>
                    action.trigger.some(t => t.type !== "manual" && t.isActive)
                  );

                  if (autoTriggersInGroup) {
                    return (
                      <Text color="red" size="sm">
                        ⚠ {t("controllableActionList.manualDisablesAutoWarning", "Warning: Activating a manual trigger will disable auto triggers for this group. You must deactivate the manual trigger manually to re-enable the automated trigger.")}
                      </Text>
                    );
                  }

                  return null;
                })()}

                <Flex justify="flex-end" gap="md" mt="md">
                    <Button variant="light" onClick={() => setConfirmModal({open: false})}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={() => {
                        if (confirmModal.actionId && confirmModal.triggerId && confirmModal.value !== undefined && confirmModal.isActive !== undefined) {
                            handleTriggerChange(confirmModal.actionId, confirmModal.triggerId, confirmModal.value, confirmModal.isActive);
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
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 10,
                        pointerEvents: 'none',
                    }}
                >
                    Read only
                </Badge>
            )}
             <Flex direction="column" gap="sm" style={{ overflowX: 'auto', marginTop: 5 }}>
                  {Object.entries(groupedActions).map(([hardwareId, actions]) => (
                    <Card key={hardwareId} shadow="sm" p="md" withBorder>
                      {/* Group Header */}
                        {actions[0].hardware?.name &&
                            <Text fw={700} size="lg" mb="sm">
                                {actions[0].hardware?.name}
                            </Text>
                        }

                        {(() => {
                          const hasActiveManualInGroup = actions.some(a =>
                            a.trigger.some(
                              t => t.type === "manual" && t.isActive && t.id === a.status && !a.isAutomated
                            )
                          );

                          const hasAutoInGroup = actions.some(a =>
                            a.trigger.some(t => t.type !== "manual")
                          );

                          if (hasActiveManualInGroup && hasAutoInGroup) {
                            return (
                              <Badge
                                color="red"
                                variant="light"
                                size="sm"
                                style={{
                                  position: 'absolute',
                                  top: 5,
                                  right: 5,
                                  zIndex: 10,
                                }}
                              >
                                {t("controllableActionList.autoDisabledNote")}
                              </Badge>
                            );
                          }

                          return null;
                        })()}
                      {/* Group Actions */}
                      <Flex direction="column" gap="sm">
                        {actions.map((action) => {
                    const manualTriggers = action.trigger.filter(t => t.type === 'manual' && t.isActive);
                    const hasAuto = action.trigger.some(t => t.type !== 'manual' && t.isActive);
                    const hasActiveManualInGroup = actions.some((a) =>
                                      a.trigger.some(
                                        (t) => t.type === "manual" && t.isActive && t.id === a.status && !a.isAutomated
                                      )
                                    );
                    return (
                        <Card key={action.id} p="sm" shadow="none">
                            <Flex align="center" justify="space-between" gap="md" wrap="nowrap">
                                {/* Left: Name */}
                                <Text fw={600} tt="capitalize" style={{whiteSpace: 'nowrap', minWidth: 150}}>
                                    {truncateText(action.name, 30)}
                                </Text>

                                {/* Right: Controls */}
                                <Flex direction="row" gap="xs" align="center" wrap="wrap">
                                    {manualTriggers.map((trigger) => {
                                        const isActive = trigger.id === action.status && !action.isAutomated;

                                        return (
                                            <Button
                                                key={trigger.id}
                                                size="xs"
                                                style={!isAdmin ? {pointerEvents: "none", opacity: 0.6} : undefined}
                                                variant={isActive ? "filled" : "light"}
                                                color={isActive ? getColor(trigger.actionValue) : "gray"}
                                                radius="xl"
                                                onClick={() => setConfirmModal({
                                                    open: true,
                                                    actionId: action.id,
                                                    triggerId: trigger.id,
                                                    value: trigger.actionValue,
                                                    isActive: isActive
                                                })}
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
                                            style={!isAdmin ? {pointerEvents: "none", opacity: 0.6} : undefined}
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
                  ))}
                </Flex>

        </Card>
    );
};

export default ControllableActionOverview;