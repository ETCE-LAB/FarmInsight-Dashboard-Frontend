import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../../../utils/Hooks";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";
import {useAuth} from "react-oidc-context";
import {lowerFirst} from "@mantine/hooks";

import {
    Button,
    Card,
    Flex,
    NumberInput,
    SegmentedControl, Slider,
    Switch,
    Text
} from "@mantine/core";
import {executeTrigger} from "../useCase/executeTrigger";
import {updateControllableActionStatus, updateIsAutomated} from "../state/ControllableActionSlice";

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

const ControllableActionOverview: React.FC<{ fpfId: string }> = ({ fpfId }) => {

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const controllableAction = useSelector((state: RootState) => state.controllableAction.controllableAction);
    const auth = useAuth();


    const handleTriggerChange = async (actionId: string, triggerId: string, value: string) => {
        try {
            await executeTrigger(actionId, triggerId, value);
            dispatch(updateIsAutomated({ actionId: actionId, isAutomated: false }));
            dispatch(updateControllableActionStatus({ actionId, triggerId }));
            } catch (error) {
                console.error("Failed to execute trigger", error);
        }
    };


    return (
        <Card radius="md" padding="md">
                <Flex direction="column" gap="sm" style={{ overflowX: 'auto' }}>

                    {controllableAction.map((action) => {
                        const manualTriggers = action.trigger.filter(t => t.type === 'manual' && t.isActive);
                        const hasAuto = action.trigger.some(t => t.type !== 'manual' && t.isActive);

                        return (
                          <Card key={action.id} p="sm" >
                            <Flex align="center" justify="space-between" gap="md" wrap="nowrap">
                              {/* Left: Name */}
                              <Text fw={600} tt="capitalize" style={{ whiteSpace: 'nowrap', minWidth: 150 }}>
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
                                        variant={isActive ? "filled" : "light"}
                                        color={isActive ? getColor(trigger.actionValue) : "gray"}
                                        radius="xl"
                                        onClick={() => handleTriggerChange(action.id, trigger.id, trigger.actionValue)}
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
                                      onClick={() => {
                                        executeTrigger(action.id, "auto", "").then(() => {
                                          dispatch(updateControllableActionStatus({ actionId: action.id, triggerId: "" }));
                                          dispatch(updateIsAutomated({ actionId: action.id, isAutomated: true }));
                                        });
                                      }}
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
};

export default ControllableActionOverview;
