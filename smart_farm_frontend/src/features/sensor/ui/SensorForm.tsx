import React, { useEffect, useState } from "react";
import {Box, Button, Grid, NumberInput, Switch, TextInput, Text, Select} from "@mantine/core";
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
import {notifications, showNotification} from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import {IconMobiledata, IconMobiledataOff, IconSum, IconSumOff} from "@tabler/icons-react";
import {MultiLanguageInput} from "../../../utils/MultiLanguageInput";
import {Hardware} from "../../hardware/models/hardware";
import {fetchAvailableHardware} from "../../controllables/useCase/fetchAvailableHardware";
import {getBackendTranslation} from "../../../utils/utils";

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
    const[aggregate, setAggregate] = useState<boolean>(false);
    const [hardwareConfiguration, setHardwareConfiguration] = useState<{ sensorClassId: string, additionalInformation: Record<string, any> } | undefined>(undefined);
    const [availableHardware, setAvailableHardware] = useState<Hardware[]>();
    const [hardwareId, setHardwareId] = useState<string | null>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

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
            setAggregate(toEditSensor.aggregate || false);
            setHardwareId(toEditSensor.hardwareId);
        }
        const id = fpfId || toEditSensor?.fpfId;
        if (id) {
            fetchAvailableHardware(id).then(hardwareList => {
                setAvailableHardware(hardwareList)
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError') + t('hardware.title'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [toEditSensor, fpfId, t]);

    const handleEdit = () => {
        if (toEditSensor && hardwareConfiguration) {
            setClosed(false);
            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: t('sensor.updatingSensor'),
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
                aggregate,
                hardwareConfiguration,
                hardwareId,
            }).then((sensor) => {
                notifications.update({
                    id,
                    title: t('common.updateSuccess'),
                    message: ``,
                    color: 'green',
                    loading: false,
                    autoClose: 2000,
                });
                dispatch(receivedSensor());
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
        if (hardwareConfiguration && fpfId && organizationId) {
            setClosed(false);
            const interval = +intervalSeconds;
            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: t('sensor.creatingSensor'),
                autoClose: false,
                withCloseButton: false,
            });
            createSensor({
                id: '', name, unit, parameter, location, modelNr, intervalSeconds: interval, isActive, fpfId, aggregate ,hardwareConfiguration, hardwareId
            }).then((response) => {
                notifications.update({
                    id,
                    title: t('common.saveSuccess'),
                    message: ``,
                    color: 'green',
                    loading: false,
                    autoClose: 2000,
                });
                dispatch(receivedSensor());

                navigate(AppRoutes.editFpf.replace(":organizationId", organizationId).replace(":fpfId", fpfId));
            }).catch((error) => {
                notifications.update({
                    id,
                    title: t('common.saveError'),
                    message: `${error}`,
                    color: 'red',
                    loading: false,
                    autoClose: 2000,
                });
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
                            <MultiLanguageInput
                                label={t("header.name")}
                                placeholder={t("header.enterName")}
                                required={true}
                                value={name}
                                onChange={(value) => {console.log(value);setName(value);}}
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

                        {availableHardware &&
                            <Grid.Col span={6}>
                                <Select
                                    label={t("hardware.title")}
                                    placeholder={t("hardware.select")}
                                    description={t("hardware.toPing")}
                                    checkIconPosition="left"
                                    data={availableHardware.map((v): { value: string; label: string } => ({ value: v.id, label: getBackendTranslation(v.name, i18n.language)}))}
                                    value={hardwareId}
                                    onChange={setHardwareId}
                                />
                            </Grid.Col>
                        }

                        {/* Aggregate Switch */}
                        <Grid.Col span={6} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{marginBottom:"1rem"}}>{t("sensorList.aggregate")}</Text>
                            <Switch

                                onLabel={<IconSum size={16} />}
                                offLabel={<IconSumOff size={16} />}
                                size="md"
                                checked={aggregate}
                                onChange={() => setAggregate(!aggregate)}
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
