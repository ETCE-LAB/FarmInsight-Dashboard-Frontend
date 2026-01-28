import React, { useEffect, useState } from 'react';
import { Button, TextInput, Box, Switch, Grid, Title } from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { createFpf } from "../useCase/createFpf";
import { useDispatch } from "react-redux";
import { createdFpf, updatedFpf } from "../state/FpfSlice";
import { Fpf } from "../models/Fpf";
import { useTranslation } from 'react-i18next';
import { updateFpf } from "../useCase/updateFpf";
import { notifications } from "@mantine/notifications";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { SelectFPFLocation } from "../../location/ui/SelectFPFLocation";
import { Location } from "../../location/models/location";


export const FpfForm: React.FC<{ organizationId: string, toEditFpf?: Fpf, close: React.Dispatch<React.SetStateAction<boolean>>; }> = ({ organizationId, toEditFpf, close }) => {
    const auth = useAuth();
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [sensorServiceIp, setSensorServiceIp] = useState("");
    const [location, setLocation] = useState<Location | undefined>(undefined);
    const [errors, setErrors] = useState<{ name?: string; sensorServiceIp?: string; location?: string }>({});
    const dispatch = useDispatch();

    useEffect(() => {
        if (toEditFpf) {
            setName(toEditFpf.name);
            setIsPublic(toEditFpf.isPublic);
            setSensorServiceIp(toEditFpf.sensorServiceIp);
            setLocation(toEditFpf.Location);
        }
    }, [toEditFpf]);


    const getErrorsFromResponse = (error: string) => {
        let msg = '';
        try {
            const errorObj = JSON.parse(error);
            if ('details' in errorObj) {
                if (typeof errorObj['details'] === 'string') {
                    msg = `${errorObj['details']}`
                } else {
                    let ipError = undefined;
                    if ('sensorServiceIp' in errorObj['details']) {
                        ipError = errorObj['details']['sensorServiceIp'];
                    }

                    let nameError = undefined;
                    if ('non_field_errors' in errorObj['details'] && 'name' in errorObj['details']['non_field_errors']) {
                        nameError = errorObj['details']['non_field_errors']['name'];
                    }
                    setErrors({ name: nameError, sensorServiceIp: ipError });
                }
            } else {
                msg = `${error}`
            }
        } catch (e) {
            msg = `${error}`
        }

        return msg;
    }

    const handleSave = () => {
        // Validate location is selected
        if (!location) {
            setErrors(prev => ({ ...prev, location: t('fpf.error.locationRequired') }));
            return;
        }
        setErrors(prev => ({ ...prev, location: undefined }));

        if (organizationId && name) {
            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: '',
                autoClose: false,
                withCloseButton: false,
            });

            const locationId = location.id;
            createFpf({ organizationId, name, isPublic, sensorServiceIp, locationId }).then(fpf => {
                dispatch(createdFpf());
                dispatch(updatedFpf(fpf));

                notifications.update({
                    id,
                    title: t('common.success'),
                    message: t(`common.saveSuccess`),
                    color: 'green',
                    loading: false,
                    autoClose: 2000,
                });

                close(false);
            }).catch((error) => {
                const msg = getErrorsFromResponse(error);
                notifications.update({
                    id,
                    title: t('common.saveError'),
                    message: msg,
                    color: 'red',
                    loading: false,
                    autoClose: 10000,
                });
            });
        }
    };

    const onClickEdit = () => {
        // Validate location is selected
        if (!location) {
            setErrors(prev => ({ ...prev, location: t('fpf.error.locationRequired') }));
            return;
        }
        setErrors(prev => ({ ...prev, location: undefined }));

        if (toEditFpf) {
            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: '',
                autoClose: false,
                withCloseButton: false,
            });

            const locationId = location?.id || '';
            updateFpf(toEditFpf.id, { name, isPublic, sensorServiceIp, locationId }).then(fpf => {
                dispatch(updatedFpf(fpf));
                dispatch(createdFpf());
                notifications.update({
                    id,
                    title: t('common.updateSuccess'),
                    message: '',
                    color: 'green',
                    loading: false,
                    autoClose: 2000,
                });
            }).catch((error) => {
                const msg = getErrorsFromResponse(error);
                notifications.update({
                    id,
                    title: t('common.updateError'),
                    message: `${msg}`,
                    color: 'red',
                    loading: false,
                    autoClose: 10000,
                });
            });
        }
        close(false);
    };

    return (
        <>
            {!auth.isAuthenticated ? (
                <Button onClick={() => auth.signinRedirect()} variant="filled" color="#105385" style={{ margin: '10px' }}>
                    {t("header.loginToManage")}
                </Button>
            ) : (
                <>
                    {!toEditFpf && (
                        <Title order={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
                            {t("fpf.createFpF")}
                        </Title>
                    )}
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <Grid gutter="md">
                            {/* Name Input */}
                            <Grid.Col span={6}>
                                <TextInput
                                    label={t("header.name")}
                                    placeholder={t("header.enterName")}
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.currentTarget.value)}
                                    error={errors.name}
                                />
                            </Grid.Col>

                            {/* Public Switch */}
                            <Grid.Col span={6}>
                                <Box
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        height: "100%",
                                    }}
                                >
                                    <span style={{ marginBottom: 5 }}>{t("header.public")}</span>
                                    <Switch
                                        //description={t("fpf.hint.publicHint")}
                                        onLabel={<IconEye size={16} stroke={2.5} />}
                                        offLabel={<IconEyeOff size={16} stroke={2.5} />}
                                        size="md"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.currentTarget.checked)}
                                    />
                                </Box>
                            </Grid.Col>

                            {/* SensorServiceIP Input */}
                            <Grid.Col span={6}>
                                <TextInput
                                    label="FPF Backend IP/URL"
                                    placeholder="Enter IP or URL"
                                    required
                                    value={sensorServiceIp}
                                    onChange={(e) => setSensorServiceIp(e.currentTarget.value)}
                                    description={t("fpf.hint.sensorServiceIpHint")}
                                    error={errors.sensorServiceIp}
                                />
                            </Grid.Col>

                            {/* Address Input */}
                            <Grid.Col span={12}>
                                <SelectFPFLocation setLocation={setLocation} organizationId={organizationId} preSelectedLocation={location} />
                                {errors.location && (
                                    <span style={{ color: 'red', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                                        {errors.location}
                                    </span>
                                )}
                            </Grid.Col>

                            {/* Save Button */}
                            <Grid.Col span={12}>
                                <Box mt="md" style={{ display: "flex", justifyContent: "flex-start" }}>
                                    <Button
                                        type="submit"
                                        variant="filled"
                                        color="#199ff4"
                                        style={{ margin: "10px" }}
                                        onClick={toEditFpf ? onClickEdit : handleSave}
                                    >
                                        {toEditFpf ? t("userprofile.saveChanges") : t("button.add")}
                                    </Button>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </form>
                </>
            )}
        </>
    );
};
