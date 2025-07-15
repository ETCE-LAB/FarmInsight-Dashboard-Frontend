import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    NumberInput,
    Switch,
    TextInput,
    Text,
    Autocomplete,
    Flex,
    Tooltip,
    Group
} from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../utils/Hooks";
import {notifications, showNotification} from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import {IconInfoCircle, IconMobiledata, IconMobiledataOff} from "@tabler/icons-react";
import {ControllableAction} from "../models/controllableAction";
import {Hardware} from "../../hardware/models/hardware";
import {fetchAvailableHardware} from "../useCase/fetchAvailableHardware";
import {fetchAvailableActionScripts} from "../useCase/fetchAvailableActionScripts";
import {createControllableAction} from "../useCase/createControllableAction";
import {addControllableAction, updateControllableActionSlice} from "../state/ControllableActionSlice";
import {updateControllableAction} from "../useCase/updateControllableAction";
import {capitalizeFirstLetter, getBackendTranslation} from "../../../utils/utils";
import i18n from "i18next";
import {ActionScript} from "../models/actionScript";


export const ControllableActionForm: React.FC<{ toEditAction?: ControllableAction, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ toEditAction, setClosed }) => {
    const auth = useAuth();
    const { t } = useTranslation();
    const { organizationId, fpfId } = useParams();
    const dispatch = useAppDispatch();

    const [name, setName] = useState<string>("");
    const [availableActionScripts, setAvailableActionScripts] = useState<ActionScript[]>();
    const [selectedActionScript, setSelectedActionScript] = useState<ActionScript>();
    const [isActive, setIsActive] = useState<boolean>(true);
    const [maximumDurationSeconds, setMaximumDurationSeconds] = useState<number>(0);
    const [hardware, setHardware] = useState<Hardware>({id: "", FPF: "", name: ""});
    const [availableHardware, setAvailableHardware] = useState<Hardware[]>();
    const [hardwareInput, setHardwareInput] = useState<string>("");
    const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string>>({});

    useEffect(() => {
        if (toEditAction) {
            setName(toEditAction.name || "");
            setIsActive(toEditAction.isActive || false);
            setMaximumDurationSeconds(toEditAction.maximumDurationSeconds || 0);

            if (toEditAction && toEditAction.hardware) {
                const initial: Hardware = {
                    id: toEditAction.hardware.id,
                    FPF: fpfId || "",
                    name: toEditAction.hardware.name
                };
                setHardware(initial);
                setHardwareInput(initial.name);
            } else {
                // Reset states when no hardware is present
                setHardware({id: "", FPF: "", name: ""});
                setHardwareInput("");
            }
        }
    }, [fpfId, toEditAction]);

    useEffect(() => {
        if(availableActionScripts && toEditAction){
            const match = availableActionScripts.find(h => h.action_script_class_id === toEditAction.actionClassId);
            setSelectedActionScript(match);

            const additionalInfo = JSON.parse(toEditAction.additionalInformation || "{}");
            match?.fields.forEach(field => {
                setDynamicFieldValues(prev => ({
                    ...prev,
                    [field.id]: additionalInfo[field.id] || ""
                }));
            });
          }
    }, [availableActionScripts, toEditAction]);

    useEffect(() => {
        if (fpfId){
            fetchAvailableHardware(fpfId).then(hardwareList => {
                setAvailableHardware(hardwareList)
            }).catch((error) => {
                console.dir(error);
                showNotification({
                    title: t('common.loadError') + t('hardware.title'),
                    message: `${error}`,
                    color: 'red',
                });
            });

            fetchAvailableActionScripts().then(scripts => {
                setAvailableActionScripts(scripts);
            }).catch((error) => {
                console.dir(error);
                showNotification({
                    title: t('common.loadErrorGeneric'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [toEditAction, fpfId, t]);

    const handleDynamicFieldChange = (fieldName: string, value: string) => {
      setDynamicFieldValues(prev => ({
        ...prev,
        [fieldName]: value,
      }));
    };

    const handleEdit = () => {
        if (toEditAction && fpfId && selectedActionScript) {
            setClosed(false);

            const sanitizedAdditionalInfo = Object.fromEntries(
              selectedActionScript.fields.map(field => [field.id, dynamicFieldValues[field.id] || ""])
            );

            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: t('controllableActionList.updating'),
                autoClose: false,
                withCloseButton: false,
            });

            updateControllableAction({
                fpfId: fpfId,
                id: toEditAction.id,
                name: name,
                actionClassId: selectedActionScript.action_script_class_id,
                isActive: isActive,
                maximumDurationSeconds: maximumDurationSeconds,
                additionalInformation: JSON.stringify(sanitizedAdditionalInfo),
                hardwareId: hardware ? hardware.id : null ,
                hardware: hardware,
                trigger: [],
            }).then((action) => {
                dispatch(updateControllableActionSlice(action));
                notifications.update({
                    id,
                    title: t('common.updateSuccess'),
                    message: '',
                    color: 'green',
                    loading: false,
                    autoClose: 2000,
                });
            }).catch((error) => {
                notifications.update({
                    id,
                    title: t('common.updateError'),
                    message: `${error}`,
                    color: 'red',
                    loading: false,
                    autoClose: 10000,
                });
            });
        }
    };

    const handleSave = () => {
        if (selectedActionScript && fpfId && organizationId) {
            setClosed(false);
            const interval = +maximumDurationSeconds;
            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: t('controllableActionList.creating'),
                autoClose: false,
                withCloseButton: false,
            });
            createControllableAction({
                fpfId:fpfId,
                id: '',
                name: name,
                actionClassId: selectedActionScript.action_script_class_id,
                isActive: isActive,
                maximumDurationSeconds: interval,
                additionalInformation: JSON.stringify(dynamicFieldValues),
                hardwareId: hardware?.id || "",
                hardware: hardware,
                trigger: []
            }).then((response) => {
                if (response) {
                    dispatch(addControllableAction(response));
                    notifications.update({
                        id,
                        title: t('common.saveSuccess'),
                        message: '',
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: t('common.saveError'),
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
                    toEditAction ? handleEdit() : handleSave();
                }}>
                    <Grid gutter="md">
                        {/* Name */}
                        <Grid.Col span={12}>
                            <TextInput
                                label={t("header.name")}
                                placeholder={t("header.enterName")}
                                required
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                description={t("controllableActionList.hint.nameHint")}
                            />
                        </Grid.Col>

                        {/* Hardware */}
                        <Grid.Col span={12}>
                            {fpfId && (
                                <Autocomplete
                                    label="Hardware"
                                    placeholder="Search hardware"
                                    data={availableHardware?.map((v) => ({value: v.id, label: v.name}))}
                                    value={hardwareInput}
                                    description={t("controllableActionList.hint.hardware")}
                                    onChange={(val) => {
                                        setHardwareInput(val);
                                        setHardware({ id: "", FPF: fpfId, name: val })
                                        if (availableHardware && val) {
                                            const foundItem = availableHardware.find(h => h.id === val);
                                            if (foundItem) {
                                                setHardware(foundItem);
                                            }
                                        }
                                        else {
                                            setHardware({ id: "", FPF: fpfId, name: hardwareInput })
                                        }
                                    }}
                                />
                            )}
                        </Grid.Col>

                        {/* ActionClass */}
                        <Grid.Col span={12}>
                            {fpfId && (
                                <Autocomplete
                                    label="Action Script"
                                    placeholder="Search action scripts"
                                    data={availableActionScripts?.map((v) => ({value: v.action_script_class_id, label: v.name}))}
                                    required
                                    description={t("controllableActionList.hint.actionClass")}
                                    value={selectedActionScript?.name}
                                    onChange={(val) => {
                                        const match = availableActionScripts?.find(h => h.action_script_class_id === val);
                                        if (match) setSelectedActionScript(match);
                                    }}
                                />
                          )}
                        </Grid.Col>

                        {selectedActionScript && (
                            <Grid.Col span={12}>
                                <Box p="md" mb={"sm"}
                                    style={{
                                        border: '1px solid',
                                        borderColor: '#228be6',
                                        borderRadius: 8,
                                    }}
                                >
                                    <Group align="center">
                                        <IconInfoCircle size={20} color="#228be6" />
                                        <Text size="sm" >
                                            {capitalizeFirstLetter(getBackendTranslation(selectedActionScript.description, i18n.language))}
                                        </Text>
                                    </Group>
                                </Box>
                            <Text fw={500} mb="sm">Additional Configuration</Text>
                                <Flex direction="column" gap="sm">
                                    {selectedActionScript.fields.map((field, index) => {
                                        switch (field.type) {
                                            case "int":
                                                return (
                                                    <NumberInput
                                                        key={index}
                                                        required={field.defaultValue === ""}
                                                        description={capitalizeFirstLetter(getBackendTranslation(field.description, i18n.language))}
                                                        placeholder={field.defaultValue}
                                                        label={
                                                            <>
                                                                {capitalizeFirstLetter(getBackendTranslation(field.name, i18n.language))}
                                                                {field.rules?.some(r => r.name === "ValidHttpEndpointRule") && (
                                                                    <Tooltip label="Must be a valid HTTP URL">
                                                                        <IconInfoCircle size={14} style={{ cursor: 'pointer' }} />
                                                                    </Tooltip>
                                                                )}
                                                            </>
                                                        }
                                                        value={dynamicFieldValues[field.id] || ""}
                                                        onChange={(value) => handleDynamicFieldChange(field.id, String(value ?? ""))}
                                                    />
                                                );
                                            case "str":
                                            default:
                                                return (
                                                    <TextInput
                                                        key={index}
                                                        required={field.defaultValue === ""}
                                                        description={capitalizeFirstLetter(getBackendTranslation(field.description, i18n.language))}
                                                        placeholder={field.defaultValue}
                                                        label={
                                                            <>
                                                                {capitalizeFirstLetter(getBackendTranslation(field.name, i18n.language))}
                                                                {field.rules?.some(r => r.name === "ValidHttpEndpointRule") && (
                                                                    <Tooltip label="Must be a valid HTTP URL">
                                                                        <IconInfoCircle size={14} style={{ cursor: 'pointer' }} />
                                                                    </Tooltip>
                                                                )}
                                                            </>
                                                        }
                                                        value={dynamicFieldValues[field.id] || ""}
                                                        onChange={(event) =>
                                                            handleDynamicFieldChange(field.id, event.currentTarget.value)
                                                        }
                                                    />
                                                );
                                        }
                                    })}
                                </Flex>
                            </Grid.Col>
                        )}

                        {/* MaximumDurationSeconds */}
                        <Grid.Col span={12}>
                            <NumberInput
                                label={t("controllableActionList.maximumDurationSeconds")}
                                placeholder={t("controllableActionList.maximumDurationSeconds")}
                                value={maximumDurationSeconds}
                                onChange={(value) => setMaximumDurationSeconds(value as number ?? 1)}
                                description={t("controllableActionList.hint.maximumDurationSeconds")}
                            />
                        </Grid.Col>

                        {/* Active Switch */}
                        <Grid.Col span={12} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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
                        <Grid.Col span={12}>
                            <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                                <Button type="submit" variant="filled" color="#105385" style={{ margin: '10px' }}>
                                    {toEditAction?.id ? t("userprofile.saveChanges") : t("controllableActionList.addControllable")}
                                </Button>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </form>
            )}
        </>
    );
};
