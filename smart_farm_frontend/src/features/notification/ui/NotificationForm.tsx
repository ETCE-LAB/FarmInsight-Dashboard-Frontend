import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Notification} from "../models/notification";
import {Box, Button, Flex, TextInput} from "@mantine/core";
import {showNotification as showMantineNotification} from "@mantine/notifications";
import {createNotification} from "../useCase/createNotification";

/**
 * NotificationForm Component
 *
 * Form for CREATING notification rooms.
 *
 * Props:
 * close (function) - Callback to close the modal after save
 *
 * Fields:
 * - room_id: Text input
 * - name: Text input for display name
 *
 * Behavior:
 * - On submit: Calls create API
 * - Shows success/error notifications using Mantine
 * - Closes modal on success
 */
export const NotificationForm: React.FC<{
    close: () => void
}> = ({ close }) => {
    const {t} = useTranslation();

    const [notification, setNotification] = useState<Notification>({
        room_id: '',
        name: ''
    } as Notification);


    const handleInputChange = (field: string, value: any) => {
        setNotification((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Only "Create" logic remains
        createNotification(notification).then(() => {
            showMantineNotification({
                title: t('common.saveSuccess'),
                message: '',
                color: "green",
            });
            close();
        }).catch((error) => {
            showMantineNotification({
                title: t('common.saveError'),
                message: `${error}`,
                color: "red",
            });
        });
    };

    return (
        <Box>
            <TextInput
                label={t("notification.roomId")}
                placeholder={t("notification.roomIdPlaceholder")}
                required={true}
                value={notification.room_id}
                onChange={(e) => handleInputChange("room_id", e.currentTarget.value)}
                // "disabled" prop removed, as it was only for editing
                mb="md"
            />
            <TextInput
                label={t("notification.name")}
                placeholder={t("notification.namePlaceholder")}
                required={true}
                value={notification.name}
                onChange={(e) => handleInputChange("name", e.currentTarget.value)}
                mb="md"
            />
            <Flex justify="flex-end">
                <Button
                    style={{ width: "30%", marginTop: "1rem" }}
                    type="submit"
                    onClick={handleSubmit}
                >
                    {t("common.saveButton")}
                </Button>
            </Flex>
        </Box>
    );
}