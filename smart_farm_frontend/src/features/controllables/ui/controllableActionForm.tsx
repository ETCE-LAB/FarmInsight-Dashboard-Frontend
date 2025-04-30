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
import {addControllableAction, setControllableAction} from "../state/ControllableActionSlice";

export type ActionScriptField = {
  name: string;
  type: string;
  rules?: { name: string }[];
};

export const ControllableActionForm: React.FC<{ toEditAction?: ControllableAction, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ toEditAction, setClosed }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { organizationId, fpfId } = useParams();
    const dispatch = useAppDispatch();

    const [name, setName] = useState<string>("");
    const [availableActionScripts, setAvailableActionScripts] = useState<{ value:string, label:string, fields:ActionScriptField[] }[]>();
    const [selectedActionClass, setSelectedActionClass] = useState<{value: string, label: string, fields:ActionScriptField[]}>(); // ??
    const [actionClassId, setActionCLassId] = useState<string>(""); // ??
    const [isActive, setIsActive] = useState<boolean>(false);
    const [maximumDurationSeconds, setMaximumDurationSeconds] = useState<number>(0);
    const [additionalInformation, setAdditionalInformation] = useState<string>("");
    const [hardware, setHardware] = useState<{ value: string, label: string } | null>(null);
    const [availableHardware, setAvailableHardware] = useState<{ value:string, label:string }[]>();
    const [hardwareInput, setHardwareInput] = useState<string>("");
    const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string>>({});


    useEffect(() => {
        if (toEditAction) {
            setName(toEditAction.name || "");
            setIsActive(toEditAction.isActive || false);
            setMaximumDurationSeconds(toEditAction.maximumDurationSeconds || 0);
            setAdditionalInformation(toEditAction.additionalInformation || "");
            setHardware({value: toEditAction.hardware.id, label: toEditAction.hardware.name}  || "");
        }
    }, [toEditAction]);

    useEffect(() => {
      if (toEditAction?.hardware) {
        const initial = {
          value: toEditAction.hardware.id,
          label: toEditAction.hardware.name,
        };
        setHardware(initial);
        setHardwareInput(initial.label);
      }
    }, [toEditAction]);


    useEffect(() => {
        if (fpfId){
            fetchAvailableHardware(fpfId).then(hardwareList => {
                const hardwareOptions = hardwareList?.map(h => ({
                  value: h.id,
                  label: h.name,
                })) ?? [];
                setAvailableHardware(hardwareOptions)
            });

            fetchAvailableActionScripts(fpfId).then(scripts => {
                const actionScripts = scripts?.map(s => ({
                  value: s.action_script_class_id,
                  label: s.name,
                  fields: s.fields
                })) ?? [];
                setAvailableActionScripts(actionScripts)
            })
        }

    }, []);

    const handleDynamicFieldChange = (fieldName: string, value: string) => {
      setDynamicFieldValues(prev => ({
        ...prev,
        [fieldName]: value,
      }));
    };

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
        if (selectedActionClass && fpfId && organizationId) {
            setClosed(false);
            const interval = +maximumDurationSeconds;
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Creating Controllable action..',
                autoClose: false,
                withCloseButton: false,
            });
            createControllableAction({
                fpfId:fpfId,
                id: '',
                name: name,
                actionClassId:selectedActionClass.value,
                isActive: isActive,
                maximumDurationSeconds: interval,
                additionalInformation: JSON.stringify(dynamicFieldValues),
                hardwareId: hardware?.value || "",
                trigger: []
            }).then((response) => {
                if (response) {
                    dispatch(addControllableAction(response));

                    notifications.update({
                        id,
                        title: 'Success',
                        message: `Controllable action created successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error saving the sensor.',
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
                              data={availableHardware}
                              value={hardwareInput}
                              description={t("controllableActionList.hint.hardware")}
                              onChange={(val) => {
                                setHardwareInput(val);
                                const match = availableHardware?.find(h => h.label === val);
                                setHardware(match || null);
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
                                  data={availableActionScripts}
                                  required
                                  description={t("controllableActionList.hint.actionClass")}
                                  value={selectedActionClass?.label}
                                  onChange={(val) => {
                                    setActionCLassId(val);

                                    const match = availableActionScripts?.find(h => h.label === val);
                                    setSelectedActionClass({value: match?.value || "", label:match?.label || "", fields: match?.fields || []}); // update selected script only if it matches
                                  }}
                                />
                          )}
                        </Grid.Col>

                        {selectedActionClass && (
                          <Grid.Col span={12}>
                            <Text fw={500} mb="sm">Additional Configuration</Text>

                            <Flex direction="column" gap="sm">
                              {selectedActionClass.fields.map((field, index) => {
                                switch (field.type) {
                                  case "str":
                                  default:
                                    return (
                                      <TextInput
                                          key={index}
                                          required
                                          label={
                                            <Flex align="center" gap="xs">
                                              <Text size="sm">{field.name}</Text>
                                              {field.rules?.some(r => r.name === "ValidHttpEndpointRule") && (
                                                <Tooltip label="Must be a valid HTTP URL">
                                                  <IconInfoCircle size={14} style={{ cursor: 'pointer' }} />
                                                </Tooltip>
                                              )}
                                            </Flex>
                                          }
                                          value={dynamicFieldValues[field.name] || ""}
                                          onChange={(event) =>
                                            handleDynamicFieldChange(field.name, event.currentTarget.value)
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

                        {/* Additional Information */}
                        <Grid.Col span={12}>
                            {fpfId && (
                                <></>
                            )}
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
