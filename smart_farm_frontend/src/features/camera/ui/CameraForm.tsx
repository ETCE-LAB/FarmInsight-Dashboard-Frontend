import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router-dom";
import { AppRoutes } from "../../../utils/appRoutes";
import {Box, Button, Grid, NumberInput, Switch, Text, TextInput} from "@mantine/core";
import { useAppDispatch } from "../../../utils/Hooks";
import { EditCamera } from "../models/camera";
import { createCamera } from "../useCase/createCamera";
import { updateCamera } from "../useCase/updateCamera";
import { createdCamera } from "../state/CameraSlice";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconVideo, IconVideoOff } from "@tabler/icons-react";

export const CameraForm: React.FC<{ toEditCamera?: EditCamera, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ toEditCamera, setClosed }) => {
    const auth = useAuth();
    const { organizationId, fpfId } = useParams();
    const dispatch = useAppDispatch()

    const [name, setName] = useState<string>("")
    const [modelNr, setModelNr] = useState<string>("")
    const [isActive, setIsActive] = useState<boolean>(false)
    const [intervalSeconds, setIntervalSeconds] = useState<number>(3600)
    const [location, setLocation] = useState<string>("")
    const [resolution, setResolution] = useState<string>("")
    const [snapshotUrl, setSnapshotUrl] = useState<string>("")
    const [livestreamUrl, setLivestreamUrl] = useState<string>("")
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        if (toEditCamera) {
            setName(toEditCamera.name || "");
            setLocation(toEditCamera.location || "");
            setModelNr(toEditCamera.modelNr || "");
            setIsActive(toEditCamera.isActive || false);
            setIntervalSeconds(toEditCamera.intervalSeconds || 1);
            setLocation(toEditCamera.location || "");
            setResolution(toEditCamera.resolution || "")
            setSnapshotUrl(toEditCamera.snapshotUrl || "")
            setLivestreamUrl(toEditCamera.livestreamUrl)
        }
    }, [toEditCamera]);

    const handleEdit = () => {
        if (toEditCamera && fpfId) {
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Updating Camera on your FPF',
                autoClose: false,
                withCloseButton: false,
            });

            updateCamera({
                fpfId,
                id: toEditCamera.id,
                name,
                location,
                modelNr,
                resolution,
                intervalSeconds,
                snapshotUrl,
                livestreamUrl,
                isActive,
            }).then((camera) => {
                if (camera) {
                    setClosed(false)
                    dispatch(createdCamera())
                    console.dir(camera);
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `Camera updated successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error updating the camera.',
                        message: `${camera}`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                }
            });
        }
    };

    const handleSave = () => {
        if (fpfId && organizationId) {
            const id = notifications.show({
                loading: true,
                title: 'Loading',
                message: 'Saving Sensor on your FPF',
                autoClose: false,
                withCloseButton: false,
            });
            createCamera({
                fpfId, id: "", name, location, modelNr, resolution, isActive, intervalSeconds, livestreamUrl, snapshotUrl
            }).then((camera) => {
                if (camera) {
                    dispatch(createdCamera())
                    setClosed(false)
                    navigate(AppRoutes.editFpf.replace(":organizationId", organizationId).replace(":fpfId", fpfId));
                    notifications.update({
                        id,
                        title: 'Success',
                        message: `Camera saved successfully.`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    notifications.update({
                        id,
                        title: 'There was an error saving the camera.',
                        message: `${camera}`,
                        color: 'green',
                        loading: false,
                        autoClose: 2000,
                    });
                }
            })
        }
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
                    toEditCamera ? handleEdit() : handleSave();
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
                                description={t("camera.hint.nameHint")} // Add hint for the name field
                            />
                        </Grid.Col>

                        {/* Location */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("camera.location")}
                                placeholder={t("camera.enterLocation")}
                                required
                                value={location}
                                onChange={(e) => setLocation(e.currentTarget.value)}
                                description={t("camera.hint.locationHint")} // Add hint for the location field
                            />
                        </Grid.Col>

                        {/* Model Number */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("camera.modelNr")}
                                placeholder={t("camera.enterModelNr")}
                                required
                                value={modelNr}
                                onChange={(e) => setModelNr(e.currentTarget.value)}
                                description={t("camera.hint.modelNrHint")} // Add hint for the model number field
                            />
                        </Grid.Col>

                        {/* Interval Seconds */}
                        <Grid.Col span={6}>
                            <NumberInput
                                label={t("camera.intervalSeconds")}
                                placeholder={t("camera.enterIntervalSeconds")}
                                required
                                value={intervalSeconds}
                                onChange={(value) => setIntervalSeconds(value as number ?? 1)}
                                description={t("camera.hint.intervalSecondsHint")} // Add hint for the interval seconds field
                            />
                        </Grid.Col>

                        {/* Resolution */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("camera.resolution")}
                                placeholder={t("camera.enterResolution")}
                                required
                                value={resolution}
                                onChange={(e) => setResolution(e.currentTarget.value)}
                                description={t("camera.hint.resolutionHint")} // Add hint for the resolution field
                            />
                        </Grid.Col>

                        {/* Livestream URL */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("camera.livestreamUrl")}
                                placeholder={t("camera.enterLivestreamUrl")}
                                required
                                value={livestreamUrl}
                                onChange={(e) => setLivestreamUrl(e.currentTarget.value)}
                                description={t("camera.hint.livestreamUrlHint")} // Add hint for the livestream URL field
                            />
                        </Grid.Col>

                        {/* Snapshot URL */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t("camera.snapshotUrl")}
                                placeholder={t("camera.enterSnapshotUrl")}
                                required
                                value={snapshotUrl}
                                onChange={(e) => setSnapshotUrl(e.currentTarget.value)}
                                description={t("camera.hint.snapshotUrlHint")}
                            />
                        </Grid.Col>

                        {/* Active Switch next to Snapshot URL */}
                        <Grid.Col span={6} style={{ display: "flex", flexDirection: "column", alignItems: "center" ,justifyContent: "center" }}>
                            {/* Active Text */}
                            <Text style={{ marginBottom: '8px' }}>
                                {t("header.isActive")}
                            </Text>
                            {/* Switch */}
                            <Switch
                                onLabel={<IconVideo size={16} />}
                                offLabel={<IconVideoOff size={16} />}
                                size="md"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                            />
                        </Grid.Col>

                        {/* Submit Button */}
                        <Grid.Col span={12}>
                            <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                                <Button type="submit" variant="filled" color="#105385" style={{ margin: '10px' }}>
                                    {toEditCamera?.id ? t("userprofile.saveChanges") : t("camera.addCamera")}
                                </Button>
                            </Box>
                        </Grid.Col>

                    </Grid>

                </form>
            )}
        </>
    )
}
