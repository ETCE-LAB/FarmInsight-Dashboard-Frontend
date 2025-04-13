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
import {ControllableAction} from "../models/controllableAction";
import {Hardware} from "../models/hardware";
import {fetchAvailableHardware} from "../useCase/fetchAvailableHardware";
import {fetchAvailableActionScripts} from "../useCase/fetchAvailableActionScripts";
import {createControllableAction} from "../useCase/createControllableAction";
import {ActionTrigger} from "../models/actionTrigger";
import {createActionTrigger} from "../useCase/createActionTrigger";

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

    const [type, setType] = useState<string>("");
    const [actionValueType, setActionValueType] = useState<string>("");
    const [actionValue, setActionValue] = useState<string>("");
    const [triggerLogic, setTriggerLogic] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if (toEditTrigger) {
            setType(toEditTrigger.type || "");
            setActionValueType(toEditTrigger.actionValueType || "");
            setActionValue(toEditTrigger.actionValue || "");
            setTriggerLogic(toEditTrigger.triggerLogic || "");
            setDescription(toEditTrigger.description || "");
        }
    }, [toEditTrigger]);

    console.log(actionId)
    const handleEdit = () => {
        /*if (toEditAction && hardwareConfiguration) {
            setClosed(false);
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Updating Controllable Action on your FPF',
                autoClose: false,
                withCloseButton: false,
            });
            updateSensor({
                id: toEditSensor.id,
                name,
                unit,
                parameter,
                location,
                modelNr,
                intervalSeconds,
                isActive,
                fpfId: toEditSensor.fpfId,
                hardwareConfiguration,
            }).then((sensor) => {
                if (sensor) {
                    dispatch(receivedSensor());
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `Sensor updated successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error updating the sensor.',
                        message: `${sensor}`,
                        color: 'red',
                        loading: false,
                        autoClose: 10000,
                    });
                }
            });
        }*/
    };

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

                // TODO dispatch add event

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
                            <TextInput
                                label={t("controllableActionList.trigger.type")}
                                placeholder={t("controllableActionList.trigger.enterType")}
                                required
                                value={type}
                                onChange={(e) => setType(e.currentTarget.value)}
                                description={t("controllableActionList.trigger.hint.typeHint")}
                            />
                        </Grid.Col>

                        {/* actionValueType */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("controllableActionList.trigger.actionValueType")}
                                placeholder={t("controllableActionList.trigger.enterActionValueType")}
                                required
                                value={actionValueType}
                                onChange={(e) => setActionValueType(e.currentTarget.value)}
                                description={t("controllableActionList.trigger.hint.actionValueTypeHint")}
                            />
                        </Grid.Col>

                        {/* actionValue */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("controllableActionList.trigger.actionValue")}
                                placeholder={t("controllableActionList.trigger.enterActionValue")}
                                required
                                value={actionValue}
                                onChange={(e) => setActionValue(e.currentTarget.value)}
                                description={t("controllableActionList.trigger.hint.actionValueHint")}
                            />
                        </Grid.Col>

                        {/* triggerLogic */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("controllableActionList.trigger.triggerLogic")}
                                placeholder={t("controllableActionList.trigger.enterTriggerLogic")}
                                required
                                value={triggerLogic}
                                onChange={(e) => setTriggerLogic(e.currentTarget.value)}
                                description={t("controllableActionList.trigger.hint.triggerLogicHint")}
                            />
                        </Grid.Col>

                         {/* Active Switch */}
                        <Grid.Col span={6} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{marginTop:"1rem"}}>{t("header.isActive")}</Text>
                            <Switch
                                onLabel={<IconMobiledata size={16} />}
                                offLabel={<IconMobiledataOff size={16} />}
                                size="md"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
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

                        {/* Submit Button */}
                        <Grid.Col span={12}>
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
