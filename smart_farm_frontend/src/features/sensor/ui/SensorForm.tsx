import React, { useEffect, useState } from "react";
import { Box, Button, Grid, NumberInput, Switch, TextInput, Text } from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { EditSensor } from "../models/Sensor";
import SelectHardwareConfiguration from "../../hardwareConfiguration/ui/SelectHardwareConfiguration";
import { createSensor } from "../useCase/createSensor";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../utils/Hooks";
import { receivedSensor } from "../state/SensorSlice";
import { AppRoutes } from "../../../utils/appRoutes";
import { useNavigate } from "react-router-dom";
import { updateSensor } from "../useCase/updateSensor";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { IconMobiledata, IconMobiledataOff } from "@tabler/icons-react";

export const SensorForm: React.FC<{ toEditSensor?: EditSensor, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ toEditSensor, setClosed }) => {
    const auth = useAuth();
    const { organizationId, fpfId } = useParams();
    const [name, setName] = useState<string>("");
    const [unit, setUnit] = useState<string>("");
    const [parameter, setParameter] = useState<string>("");
    const [modelNr, setModelNr] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);
    const [intervalSeconds, setIntervalSeconds] = useState<number>(3600);
    const [location, setLocation] = useState<string>("");
    const [hardwareConfiguration, setHardwareConfiguration] = useState<{ sensorClassId: string, additionalInformation: Record<string, any> } | undefined>(undefined);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (toEditSensor) {
            setName(toEditSensor.name || "");
            setUnit(toEditSensor.unit || "");
            setParameter(toEditSensor.parameter || "");
            setModelNr(toEditSensor.modelNr || "");
            setIsActive(toEditSensor.isActive || false);
            setIntervalSeconds(toEditSensor.intervalSeconds || 1);
            setLocation(toEditSensor.location || "");
        }
    }, [toEditSensor]);

    const handleEdit = () => {
        if (toEditSensor && hardwareConfiguration) {
            setClosed(false);
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Updating Sensor on your FPF',
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
        }
    };

    const handleSave = () => {
        if (hardwareConfiguration && fpfId && organizationId) {
            setClosed(false);
            const interval = +intervalSeconds;
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Saving Sensor on your FPF',
                autoClose: false,
                withCloseButton: false,
            });
            createSensor({
                id: '', name, unit, parameter, location, modelNr, intervalSeconds: interval, isActive, fpfId, hardwareConfiguration,
            }).then((response) => {
                if (response) {
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `Sensor saved successfully.`,
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
                dispatch(receivedSensor());

                navigate(AppRoutes.editFpf.replace(":organizationId", organizationId).replace(":fpfId", fpfId));
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
                    toEditSensor ? handleEdit() : handleSave();
                }}>
                    <Grid gutter="md">
                        {/* Name */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("header.name")}
                                placeholder={t("header.enterName")}
                                required
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                description={t("sensor.hint.nameHint")}
                            />
                        </Grid.Col>

                        {/* Location */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("header.location")}
                                placeholder={t("header.enterLocation")}
                                required
                                value={location}
                                onChange={(e) => setLocation(e.currentTarget.value)}
                                description={t("sensor.hint.locationHint")}
                            />
                        </Grid.Col>

                        {/* Interval */}
                        <Grid.Col span={6}>
                            <NumberInput
                                label={t("camera.intervalSeconds")}
                                placeholder={t("camera.enterIntervalSeconds")}
                                required
                                value={intervalSeconds}
                                onChange={(value) => setIntervalSeconds(value as number ?? 1)}
                                description={t("sensor.hint.intervalSecondsHint")}
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


                        {/* Hardware Configuration */}
                        <Grid.Col span={12}>
                            {fpfId && (
                                <SelectHardwareConfiguration
                                    fpfId={fpfId}
                                    postHardwareConfiguration={setHardwareConfiguration}
                                    sensor={toEditSensor}
                                    setUnit={setUnit}
                                    setParameter={setParameter}
                                    setModel={setModelNr}
                                />
                            )}
                        </Grid.Col>

                        {/* Submit Button */}
                        <Grid.Col span={12}>
                            <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                                <Button type="submit" variant="filled" color="#105385" style={{ margin: '10px' }}>
                                    {toEditSensor?.id ? t("userprofile.saveChanges") : t("header.addSensor")}
                                </Button>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </form>
            )}
        </>
    );
};
