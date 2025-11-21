import React, {useCallback, useEffect, useState} from "react";
import {Notification} from "../models/notification";
import {
    Box,
    Group,
    Table,
    Title,
    Text,
    Modal,
    Button
} from "@mantine/core";
import {IconCirclePlus, IconTrash} from "@tabler/icons-react";
import {useTranslation} from "react-i18next";
import {NotificationForm} from "./NotificationForm";
import {removeNotification} from "../useCase/removeNotification";
import {showNotification as showMantineNotification} from "@mantine/notifications";
import {getAllNotifications} from "../useCase/getAllNotifications";


/**
 * NotificationList Component
 *
 * Displays a table of all notification rooms with Add/Delete operations.
 *
 * Props:
 * isAdmin (boolean) - Whether current user has admin privileges (shows add/delete buttons)
 *
 * Features:
 * - Displays all notification rooms in a table
 * - Add new notification (opens modal with form)
 * - Delete notification (shows confirmation dialog)
 * - Auto-refresh list after any operation
 *
 * Table Columns:
 * - Room ID: The unique identifier
 * - Name: Display name
 * - Actions: Delete icon (if admin)
 */
export const NotificationList: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { t } = useTranslation();

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState<Notification | undefined>(undefined);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

    const fetchNotifications = useCallback(() => {
        getAllNotifications().then((response) => {
            setNotifications(response);
        }).catch((error) => {
            showMantineNotification({
                title: t('common.loadError'),
                message: `${error}`,
                color: "red",
            });
        });
    }, [t]);

    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleDelete = (notification: Notification) => {
        setNotificationToDelete(notification);
        setConfirmationModalOpen(true);
    };

    const confirmDelete = () => {
        if (notificationToDelete) {
            removeNotification(notificationToDelete.room_id).then(() => {
                setNotificationToDelete(undefined);
                showMantineNotification({
                    title: t('common.deleteSuccess'),
                    message: '',
                    color: "green",
                });
                setConfirmationModalOpen(false);
                fetchNotifications(); // Refresh list
            }).catch((error) => {
                showMantineNotification({
                    title: t('common.deleteError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
        fetchNotifications();
    };

    const handleAddNew = () => {
        setAddModalOpen(true);
    };


    return (
        <Box>
            {/* Delete Confirmation Modal */}
            <Modal
                opened={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                title={t("notification.confirmDeletion")}
                centered
            >
                <Text style={{ fontSize: "14px", textAlign: "center", marginBottom: "1rem" }}>
                    {t("header.confirmDialog")}
                </Text>
                <Group gap="center" justify="center">
                    <Button color="red" onClick={confirmDelete}>
                        {t("header.yesDelete")}
                    </Button>
                    <Button variant="outline" onClick={() => setConfirmationModalOpen(false)}>
                        {t("header.cancel")}
                    </Button>
                </Group>
            </Modal>

            {/* Create Modal (was Create/Edit Modal) */}
            <Modal
                opened={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                title={t("notification.add")}
                centered
            >
                <NotificationForm
                    close={handleCloseAddModal}
                />
            </Modal>

            {/* Header with Add Button */}
            <Group mb="md" justify="space-between">
                <Title order={2}>{t('notification.title')}</Title>
                {isAdmin && (
                    <IconCirclePlus
                        size={25}
                        stroke={2}
                        color={"#199ff4"}
                        style={{ cursor: "pointer" }}
                        onClick={handleAddNew}
                    />
                )}
            </Group>

            {/* Notifications Table */}
            {notifications && notifications.length > 0 ? (
                <Table highlightOnHover withColumnBorders style={{ minWidth: "100%" }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t("notification.roomId")}</Table.Th>
                            <Table.Th>{t("notification.name")}</Table.Th>
                            {isAdmin && <Table.Th style={{ width: "100px" }}>{t("header.actions")}</Table.Th>}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {notifications.map((notification) => (
                            <Table.Tr key={notification.room_id}>
                                <Table.Td>{notification.room_id}</Table.Td>
                                <Table.Td>{notification.name}</Table.Td>
                                {isAdmin && (
                                    <Table.Td>
                                        <IconTrash
                                            onClick={() => handleDelete(notification)}
                                            size={20}
                                            style={{ cursor: "pointer", color: "#a53737" }}
                                        />
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <Text>{t('notification.notFound')}</Text>
            )}
        </Box>
    );
}