import React, { useEffect, useState } from "react";
import {Box, Button, Grid, Switch, TextInput, Text, Autocomplete} from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../utils/Hooks";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import {IconMobiledata, IconMobiledataOff} from "@tabler/icons-react";
import {ActionTrigger} from "../models/actionTrigger";
import {createActionTrigger} from "../useCase/createActionTrigger";
import {updateActionTrigger} from "../useCase/updateActionTrigger";
import {addActionTrigger, updateActionTriggerNotify} from "../state/ControllableActionSlice";
import {SensorTriggerForm} from "./TriggerTypes/sensorTriggerForm";
import {TimeTriggerForm} from "./TriggerTypes/timeTriggerForm";
import {triggerTypes} from "../models/triggerTypes";
import {IntervalTriggerForm} from "./TriggerTypes/intervalTriggerForm";
import {fetchAvailableActionScripts} from "../useCase/fetchAvailableActionScripts";
import {MultiLanguageInput} from "../../../utils/MultiLanguageInput";
import {ControllableAction} from "../models/controllableAction";
import {ActionScript} from "../models/actionScript";
import {getBackendTranslation} from "../../../utils/utils";


export const ActionTriggerForm: React.FC<{ action: ControllableAction, actionList: ControllableAction[], toEditTrigger?: ActionTrigger, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ action, actionList, toEditTrigger, setClosed }) => {
    const auth = useAuth();
    const { t, i18n } = useTranslation();
    const { organizationId, fpfId } = useParams();
    const dispatch = useAppDispatch();

    const [triggerId, setTriggerId] = useState<string>("")
    const [type, setType] = useState<string>("");
    const [actionValueTypes, setActionValueTypes] = useState<string[]>([""]);
    const [actionValues, setActionValues] = useState<string[]>([""]);
    const [triggerLogic, setTriggerLogic] = useState<string>("{}");
    const [description, setDescription] = useState<string>("");

    const [actionIdState, setActionId] = useState<string>("")
    const [isActive, setIsActive] = useState<boolean>(false);

    const [actionScripts, setActionScripts] = useState<ActionScript[]>([]);
    const [chainActions, setChainActions] = useState<ControllableAction[]>([]);

    useEffect(() => {
        /*
        *  Order matters, we want the Edit trigger actionValueTypes and ActionValues to have priority if they exist,
        *  but if not want the arrays to be initialized correctly
         */
        if (action.nextAction) {
            let actionChain: ControllableAction[] = [];
            for (let nextAction = actionList.find(x => x.id === action.nextAction);
                 nextAction;
                 nextAction = actionList.find(x => x.id === nextAction?.nextAction))
            {
                actionChain.push(nextAction);
            }

            if (actionValueTypes.length < actionChain.length + 1) {
                setActionValueTypes([...actionValueTypes, ...Array(actionChain.length - actionValues.length).fill("")]);
            }
            if (actionValues.length < actionChain.length + 1) {
                setActionValues([...actionValues, ...Array(actionChain.length - actionValues.length).fill("")]);
            }

            setChainActions(actionChain);
        }

        if (toEditTrigger) {
            setTriggerId(toEditTrigger.id ||"")
            setType(toEditTrigger.type || "");
            setActionValueTypes(toEditTrigger.actionValueType?.split(";") || [""]);
            setActionValues(toEditTrigger.actionValue?.split(';') || [""]);
            setTriggerLogic(toEditTrigger.triggerLogic || "");
            setDescription(toEditTrigger.description || "");
            setActionId(toEditTrigger.actionId);
            setIsActive(toEditTrigger.isActive);
        }
    }, [action, actionList, toEditTrigger]);

    useEffect(() => {
        if (fpfId) {
            fetchAvailableActionScripts(fpfId).then(scripts => {
                setActionScripts(scripts);
            })
        }
    }, [fpfId]);

    const handleEdit = () => {
        if (toEditTrigger && fpfId) {
            setClosed(false);
            const id = notifications.show({
                loading: true,
                title: t('common.updating'),
                message: t('common.loading'),
                autoClose: false,
                withCloseButton: false,
            });
            updateActionTrigger({
                fpfId: fpfId,
                id: triggerId,
                actionId: actionIdState,
                type: type,
                actionValueType: actionValueTypes.join(";"),
                actionValue: actionValues.join(';'),
                triggerLogic: triggerLogic,
                isActive: isActive,
                description: description,
            }).then((actionTrigger) => {
                if (actionTrigger) {
                    dispatch(updateActionTriggerNotify({actionId: actionTrigger.actionId, trigger: actionTrigger}));
                    notifications.update({
                        id,
                        title: t('common.success'),
                        message: t('common.updateSuccess'),
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: t('common.updateError'),
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
                title: t('common.loading'),
                message: 'Creating Trigger..',
                autoClose: false,
                withCloseButton: false,
            });
            createActionTrigger({
                fpfId:fpfId,
                id: '',
                actionId: action.id,
                type:type,
                actionValueType: actionValueTypes.join(";"),
                actionValue: actionValues.join(';'),
                triggerLogic: triggerLogic,
                isActive: isActive,
                description: description,
            }).then((response) => {
                dispatch(addActionTrigger({actionId: action.id, trigger: response}))

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

    const TriggerValueInput: React.FC<{action: ControllableAction, scripts: ActionScript[], showName: boolean, initialType: string, initialValue: string, index: number}> = ({action, scripts, showName, initialType, initialValue, index}) => {
        const [actionValueList, setActionValueList] = useState<string[]>([]);
        const [localType, setLocalType] = useState<string>(initialType);
        const [localValue, setLocalValue] = useState<string>(initialValue);

        console.log(initialType);

        useEffect(() => {
            if (scripts) {
                // Find the matching script
                const matchedScript = scripts.find(
                    (script) => script.action_script_class_id === action.actionClassId
                );

                // Set the action values if found
                if (matchedScript) {
                    setActionValueList(matchedScript.action_values);
                }
            }
        }, [scripts, action]);

        const setActionValue = (value: string) => {
            setLocalValue(value);
            let values = [...actionValues];
            values[index] = value;
            setActionValues(values);
        }

        const setActionValueType = (value: string) => {
            setLocalType(value);
            let valueTypes = [...actionValueTypes];
            valueTypes[index] = value;
            setActionValueTypes(valueTypes);
        }

        return (
            <>
                <Grid.Col span={6}>
                    <Autocomplete
                        label={showName ? `${t("controllableActionList.trigger.actionValueTypeFor")} ${getBackendTranslation(action.name, i18n.language)}` : t("controllableActionList.trigger.actionValueType")}
                        placeholder={t("controllableActionList.trigger.enterActionValueType")}
                        required
                        data={["bool", "int", "float", "string", "range"]}
                        value={localType}
                        onChange={setActionValueType}
                        description={t("controllableActionList.trigger.hint.actionValueTypeHint")}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    {actionValueList.length > 0 ?
                        <Autocomplete
                            label={showName? `${t("controllableActionList.trigger.actionValueFor")} ${getBackendTranslation(action.name, i18n.language)}` : t("controllableActionList.trigger.actionValue")}
                            placeholder={t("controllableActionList.trigger.enterActionValue")}
                            required
                            data={actionValueList}
                            value={localValue}
                            onChange={setActionValue}
                            description={t("controllableActionList.trigger.hint.actionValueHint")}
                        />
                        :
                        <TextInput
                            label={showName? `${t("controllableActionList.trigger.actionValueFor")} ${getBackendTranslation(action.name, i18n.language)}` : t("controllableActionList.trigger.actionValue")}
                            placeholder={t("controllableActionList.trigger.enterActionValue")}
                            required
                            value={localValue}
                            onChange={(e) => setActionValue(e.currentTarget.value)}
                            description={t("controllableActionList.trigger.hint.actionValueHint")}
                        />
                    }
                </Grid.Col>
            </>
        );
    }

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
                            <MultiLanguageInput
                                label={t("controllableActionList.trigger.description")}
                                placeholder={t("controllableActionList.trigger.enterDescription")}
                                required={true}
                                value={description}
                                onChange={(value) => setDescription(value)}
                                description={t("controllableActionList.trigger.hint.descriptionHint")}
                            />
                        </Grid.Col>

                        {/* actionValueType */}
                        <TriggerValueInput action={action} scripts={actionScripts} showName={action.nextAction !== null} initialType={actionValueTypes[0]} initialValue={actionValues[0]} index={0} />
                        {chainActions && chainActions.map((action, index) => (
                            <TriggerValueInput action={action} scripts={actionScripts} showName={true} initialType={actionValueTypes[index+1]} initialValue={actionValues[index+1]} index={index+1} />
                        ))}

                        {/* triggerLogic */}
                        {/* ...For Sensor */}
                        {type.toLowerCase() === triggerTypes.sensorvalue.toLowerCase() && (
                        <Grid.Col span={12}>
                            <SensorTriggerForm setTriggerLogic={setTriggerLogic} triggerLogic={toEditTrigger?.triggerLogic}/>
                        </Grid.Col>
                        )}
                        {/* ...For Time */}
                        {type.toLowerCase() === triggerTypes.timeofday.toLowerCase() && (
                            <Grid.Col span={12}>
                                <TimeTriggerForm setTriggerLogic={setTriggerLogic} triggerLogic={toEditTrigger?.triggerLogic}/>
                            </Grid.Col>
                        )}
                        {/* ...For Interval */}
                        {type.toLowerCase() === triggerTypes.interval.toLowerCase() && (
                            <Grid.Col span={12}>
                                <IntervalTriggerForm setTriggerLogic={setTriggerLogic} triggerLogic={toEditTrigger?.triggerLogic}/>
                            </Grid.Col>
                        )}

                        {/* generated JSON String */}
                        <Grid.Col span={12}>
                            <TextInput
                                label={t("controllableActionList.trigger.triggerLogic")}
                                value={toEditTrigger?.triggerLogic}
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
