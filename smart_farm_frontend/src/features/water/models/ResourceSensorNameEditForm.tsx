import React, { useState } from "react";
import { Box, Button, Group, Text, Stack, Divider } from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { useAppDispatch } from "../../../utils/Hooks";
import { receivedSensor } from "../../sensor/state/SensorSlice";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { MultiLanguageInput } from "../../../utils/MultiLanguageInput";
import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { BACKEND_URL } from "../../../env-config";
import { IconDroplet, IconPlant } from "@tabler/icons-react";

interface ResourceSensorNameEditFormProps {
    waterSensorId?: string;
    waterSensorCurrentName?: string;
    soilSensorId?: string;
    soilSensorCurrentName?: string;
    onClose: () => void;
}

export const ResourceSensorNameEditForm: React.FC<ResourceSensorNameEditFormProps> = ({
    waterSensorId = '',
    waterSensorCurrentName = '',
    soilSensorId = '',
    soilSensorCurrentName = '',
    onClose,
}) => {
    const auth = useAuth();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [waterName, setWaterName] = useState<string>(waterSensorCurrentName);
    const [soilName, setSoilName] = useState<string>(soilSensorCurrentName);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate at least one sensor name is provided
        const hasWaterSensor = waterName.trim();
        const hasSoilSensor = soilName.trim();

        if (!hasWaterSensor && !hasSoilSensor) {
            notifications.show({
                title: t('common.error'),
                message: t('sensor.nameRequired', 'At least one sensor name is required'),
                color: 'red',
            });
            return;
        }

        setIsSubmitting(true);

        const notificationId = notifications.show({
            loading: true,
            title: t('common.loading'),
            message: t('sensor.updatingSensorNames', 'Updating sensor names...'),
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const apiClient = new APIClient();
            const user = getUser();
            const token = user?.access_token;
            const headers = { 'Authorization': `Bearer ${token}` };

            const promises: Promise<any>[] = [];

            // Update water sensor if name changed
            if (waterName.trim()) {
                const waterUrl = `${BACKEND_URL}/api/sensors/resource-management/water-sensor/name`;
                promises.push(apiClient.put(waterUrl, { name: waterName }, headers));
            }

            // Update soil sensor if name changed
            if (soilName.trim()) {
                const soilUrl = `${BACKEND_URL}/api/sensors/resource-management/soil-sensor/name`;
                promises.push(apiClient.put(soilUrl, { name: soilName }, headers));
            }

            await Promise.all(promises);

            notifications.update({
                id: notificationId,
                title: t('common.updateSuccess'),
                message: t('sensor.namesUpdated', 'Sensor names updated successfully'),
                color: 'green',
                loading: false,
                autoClose: 2000,
            });

            dispatch(receivedSensor());
            onClose();
        } catch (error) {
            notifications.update({
                id: notificationId,
                title: t('common.updateError'),
                message: `${error}`,
                color: 'red',
                loading: false,
                autoClose: 10000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {!auth.isAuthenticated ? (
                <Button
                    onClick={() => auth.signinRedirect()}
                    variant="filled"
                    color="#105385"
                >
                    {t("header.loginToManageFpf")}
                </Button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Stack gap="lg">
                        {/* Water Sensor Section */}
                        <Box>
                            <Group gap="xs" mb="sm">
                                <IconDroplet size={20} color="#228be6" />
                                <Text fw={500}>{t('sensor.waterSensor', 'Water Sensor')}, ID: {waterSensorId || 'N/A'}</Text>
                            </Group>
                            <MultiLanguageInput
                                label={t("header.name")}
                                placeholder={t("header.enterName")}
                                required={false}
                                value={waterName}
                                onChange={(value) => setWaterName(value)}
                                description={t("sensor.hint.waterSensorNameHint", "Name for the water level sensor")}
                            />
                        </Box>

                        <Divider />

                        {/* Soil Sensor Section */}
                        <Box>
                            <Group gap="xs" mb="sm">
                                <IconPlant size={20} color="#40c057" />
                                <Text fw={500}>{t('sensor.soilSensor', 'Soil Sensor')}, ID: {soilSensorId || 'N/A'}</Text>
                            </Group>
                            <MultiLanguageInput
                                label={t("header.name")}
                                placeholder={t("header.enterName")}
                                required={false}
                                value={soilName}
                                onChange={(value) => setSoilName(value)}
                                description={t("sensor.hint.soilSensorNameHint", "Name for the soil moisture sensor")}
                            />
                        </Box>
                    </Stack>

                    <Group justify="flex-end" mt="xl">
                        <Button
                            variant="subtle"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            {t("common.cancel", "Cancel")}
                        </Button>
                        <Button
                            type="submit"
                            variant="filled"
                            color="#105385"
                            loading={isSubmitting}
                        >
                            {t("userprofile.saveChanges")}
                        </Button>
                    </Group>
                </form>
            )}
        </>
    );
};
