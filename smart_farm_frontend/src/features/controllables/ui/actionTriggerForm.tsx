import React, { useEffect, useState } from "react";
import {Box, Button, Grid, NumberInput, Switch, TextInput, Text, Autocomplete, Card, Flex, Tooltip} from "@mantine/core";
import { useAuth } from "react-oidc-context";
import SelectHardwareConfiguration from "../../hardwareConfiguration/ui/SelectHardwareConfiguration";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../utils/Hooks";
import { AppRoutes } from "../../../utils/appRoutes";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import {IconInfoCircle, IconMobiledata, IconMobiledataOff} from "@tabler/icons-react";
import {ActionTrigger} from "../models/actionTrigger";
import {createActionTrigger} from "../useCase/createActionTrigger";
import {updateActionTrigger} from "../useCase/updateActionTrigger";
import {addActionTrigger, updateActionTriggerNotify} from "../state/ControllableActionSlice";
import {selectControllableActionById} from "../state/ControllableActionSlice";
import {SensorTriggerForm} from "./TriggerTypes/sensorTriggerForm";
import {TimeTriggerForm} from "./TriggerTypes/timeTriggerForm";
import {triggerTypes} from "../models/triggerTypes";
import {IntervalTriggerForm} from "./TriggerTypes/intervalTriggerForm";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";
import {fetchAvailableHardware} from "../useCase/fetchAvailableHardware";
import {fetchAvailableActionScripts} from "../useCase/fetchAvailableActionScripts";

export type ActionScriptField = {
  name: string;
  type: string;
  rules?: { name: string }[];
};

export const ActionTriggerForm: React.FC<{ actionId:string, toEditTrigger?: ActionTrigger, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ actionId, toEditTrigger, setClosed }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { organizationId, fpfId } = useParams();
    const dispatch = useAppDispatch();

    const [triggerId, setTriggerId] = useState<string>("")
    const [type, setType] = useState<string>("");
    const [actionValueType, setActionValueType] = useState<string>("");
    const [actionValue, setActionValue] = useState<string>("");
    const [triggerLogic, setTriggerLogic] = useState<string>("{}");
    const [description, setDescription] = useState<string>("");

    const [actionIdState, setActionId] = useState<string>("")
    const [isActive, setIsActive] = useState<boolean>(true);
    const [actionValueList, setActionValueList] = useState<string[]>([]);
    const action = useSelector((state:RootState) =>
        selectControllableActionById(state, actionId)
    )

    useEffect(() => {
        if (toEditTrigger) {
            setTriggerId(toEditTrigger.id ||"")
            setType(toEditTrigger.type || "");
            setActionValueType(toEditTrigger.actionValueType || "");
            setActionValue(toEditTrigger.actionValue || "");
            setTriggerLogic(toEditTrigger.triggerLogic || "");
            setDescription(toEditTrigger.description || "");
            setActionId(toEditTrigger.actionId)
        }
    }, [toEditTrigger]);

    useEffect(() => {
        if (actionId && fpfId){

            fetchAvailableActionScripts(fpfId).then(scripts => {
                const actionScripts = scripts?.map(s => ({
                  value: s.action_script_class_id,
                  label: s.name,
                  description: s.description,
                  action_values: s.action_values,
                  fields: s.fields
                })) ?? [];
                // Find the matching script
              const matchedScript = actionScripts.find(
                (script) => script.value === action?.actionClassId
              );

              // Set the action values if found
              if (matchedScript) {
                setActionValueList(matchedScript.action_values);
              }
            })
        }

    }, [actionId, fpfId]);

    const handleEdit = () => {
        if (toEditTrigger && fpfId) {
            setClosed(false);
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Updating Controllable Action on your FPF',
                autoClose: false,
                withCloseButton: false,
            });
            updateActionTrigger({
                fpfId: fpfId,
                id: triggerId,
                actionId: actionIdState,
                type: type,
                actionValueType: actionValueType,
                actionValue: actionValue,
                triggerLogic: triggerLogic,
                isActive: isActive,
                description: description,
            }).then((actionTrigger) => {
                if (actionTrigger) {
                    dispatch(updateActionTriggerNotify({actionId: actionTrigger.actionId, trigger: actionTrigger}));
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `ActionTrigger updated successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error updating the ActionTrigger.',
                        message: `${actionTrigger}`,
                        color: 'red',
                        loading: false,
                        autoClose: 10000,
                    });
                }
            });
        }
    }

    const handleSave = () => {
        if (fpfId && organizationId) {
            setClosed(false);

            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Creating Trigger..',
                autoClose: false,
                withCloseButton: false,
            });
            createActionTrigger({
                fpfId:fpfId,
                id: '',
                actionId: actionId,
                type:type,
                actionValueType: actionValueType,
                actionValue: actionValue,
                triggerLogic: triggerLogic,
                isActive: isActive,
                description: description,
            }).then((response) => {
                dispatch(addActionTrigger({actionId:actionId,trigger: response}))

                if (response) {
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `Action trigger created successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error saving the trigger.',
                        message: `${response}`,
                        color: 'red',
                        loading: false,
                        autoClose: 2000,
                    });
                }

            });
        }
    };

    return (
        <>
            {!auth.isAuthenticated ? (
                <Button onClick={() => auth.signinRedirect()} variant="filled" color="#105385" style={{ margin: '10px' }}>
                    {t("header.loginToManageFpf")}
                </Button>
            ) : (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    toEditTrigger ? handleEdit() : handleSave();
                }}>
                    <Grid gutter="md">

                        {/* Type */}
                        <Grid.Col span={6}>
                          <Autocomplete
                            label={t("controllableActionList.trigger.type")}
                            placeholder={t("controllableActionList.trigger.enterType")}
                            required
                            data={[
                                triggerTypes.manual,
                                triggerTypes.sensorvalue,
                                triggerTypes.timeofday,
                                triggerTypes.interval,
                                triggerTypes.event]}
                            value={type}
                            onChange={setType}
                            description={t("controllableActionList.trigger.hint.typeHint")}
                          />
                        </Grid.Col>

                        {/* Description */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("controllableActionList.trigger.description")}
                                placeholder={t("controllableActionList.trigger.enterDescription")}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.currentTarget.value)}
                                description={t("controllableActionList.trigger.hint.descriptionHint")}
                            />
                        </Grid.Col>

                        {/* actionValueType */}
                        <Grid.Col span={6}>
                          <Autocomplete
                            label={t("controllableActionList.trigger.actionValueType")}
                            placeholder={t("controllableActionList.trigger.enterActionValueType")}
                            required
                            data={["bool", "int", "float", "string", "range"]}
                            value={actionValueType}
                            onChange={setActionValueType}
                            description={t("controllableActionList.trigger.hint.actionValueTypeHint")}
                          />
                        </Grid.Col>

                        {/* actionValue */}
                        <Grid.Col span={6}>
                            {actionValueList.length > 0 ?
                            <Autocomplete
                                label={t("controllableActionList.trigger.actionValue")}
                                placeholder={t("controllableActionList.trigger.enterActionValue")}
                                required
                                data={actionValueList}
                                value={actionValue}
                                onChange={setActionValue}
                                description={t("controllableActionList.trigger.hint.actionValueHint")}
                            />
                            :
                            <TextInput
                                label={t("controllableActionList.trigger.actionValue")}
                                placeholder={t("controllableActionList.trigger.enterActionValue")}
                                required
                                value={actionValue}
                                onChange={(e) => setActionValue(e.currentTarget.value)}
                                description={t("controllableActionList.trigger.hint.actionValueHint")}
                            />
                            }
                        </Grid.Col>

                        {/* triggerLogic */}
                        {/* ...For Sensor */}
                        {type.toLowerCase() === triggerTypes.sensorvalue.toLowerCase() && (
                        <Grid.Col span={12}>
                            <SensorTriggerForm setTriggerLogic={setTriggerLogic}/>
                        </Grid.Col>
                        )}
                        {/* ...For Time */}
                        {type.toLowerCase() === triggerTypes.timeofday.toLowerCase() && (
                            <Grid.Col span={12}>
                                <TimeTriggerForm setTriggerLogic={setTriggerLogic}/>
                            </Grid.Col>
                        )}
                        {/* ...For Interval */}
                        {type.toLowerCase() === triggerTypes.interval.toLowerCase() && (
                            <Grid.Col span={12}>
                                <IntervalTriggerForm setTriggerLogic={setTriggerLogic} actionValue={actionValue}/>
                            </Grid.Col>
                        )}

                        {/* generated JSON String */}
                        <Grid.Col span={12}>
                            <TextInput
                                label={t("controllableActionList.trigger.triggerLogic")}
                                value={triggerLogic}
                                readOnly
                                disabled
                                description={t("controllableActionList.trigger.hint.triggerLogicHint")}
                            />
                        </Grid.Col>

                         {/* Active Switch */}
                        <Grid.Col span={6} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop:"-3vh" }}>
                            <Text style={{marginTop:"1rem"}}>{t("header.isActive")}</Text>
                            <Switch
                                onLabel={<IconMobiledata size={16} />}
                                offLabel={<IconMobiledataOff size={16} />}
                                size="md"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                            />
                        </Grid.Col>

                        {/* Submit Button */}
                        <Grid.Col span={6}>
                            <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                                <Button type="submit" variant="filled" color="#105385" style={{ margin: '10px' }}>
                                    {toEditTrigger?.id ? t("userprofile.saveChanges") : t("controllableActionList.addControllable")}
                                </Button>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </form>
            )}
        </>
    );
};
