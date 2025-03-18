import React, { useEffect, useState } from 'react';
import { Button, TextInput, Box, Switch, Grid, Title } from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { createFpf } from "../useCase/createFpf";
import { useDispatch } from "react-redux";
import { AppRoutes } from "../../../utils/appRoutes";
import {createdFpf, updatedFpf} from "../state/FpfSlice";
import {useNavigate} from "react-router-dom";
import { Fpf } from "../models/Fpf";
import { useTranslation } from 'react-i18next';
import { updateFpf } from "../useCase/updateFpf";
import { notifications } from "@mantine/notifications";
import {IconEye, IconEyeOff} from "@tabler/icons-react";

export const FpfForm: React.FC<{ organizationId?: string, toEditFpf?: Fpf, close: React.Dispatch<React.SetStateAction<boolean>>; }> = ({ organizationId, toEditFpf , close}) => {
    const auth = useAuth();
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [sensorServiceIp, setSensorServiceIp] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState<{ sensorServiceIp?: string; cameraServiceIp?: string }>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (toEditFpf) {
            setName(toEditFpf.name);
            setIsPublic(toEditFpf.isPublic);
            setSensorServiceIp(toEditFpf.sensorServiceIp);
            setAddress(toEditFpf.address);
        }
    }, [toEditFpf]);

    const handleSave = () => {
        if (organizationId) {
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Updating FPF Settings',
                autoClose: false,
                withCloseButton: false,
            });

            createFpf({ name, isPublic, sensorServiceIp, address, organizationId }).then(fpf => {
                if (fpf) {
                    dispatch(createdFpf());

                    dispatch(updatedFpf(fpf));
                    navigate(AppRoutes.editFpf.replace(":organizationId", organizationId).replace(":fpfId", fpf.id));
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `FPF updated successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error updating the FPF.',
                        message: `${fpf}`,
                        color: 'red',
                        loading: false,
                        autoClose: 10000,
                    });
                }
            });
        }
        close(false);
    };

    const onClickEdit = () => {
        if (toEditFpf) {
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Updating FPF',
                autoClose: false,
                withCloseButton: false,
            });

            updateFpf(toEditFpf.id, { name, isPublic, sensorServiceIp, address }).then(fpf => {
                if (fpf) {
                    dispatch(updatedFpf(fpf));
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `FPF updated successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error updating the FPF.',
                        message: `${fpf}`,
                        color: 'red',
                        loading: false,
                        autoClose: 10000,
                    });
                }
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
                                />
                            </Grid.Col>

                            {/* Address Input */}
                            <Grid.Col span={6}>
                                <TextInput
                                    label={t("header.location")}
                                    placeholder={t("header.enterLocation")}
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.currentTarget.value)}
                                />
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
