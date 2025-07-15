import React, {useEffect, useState} from "react";
import {Group, Table, Text, Title} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {useAuth} from "react-oidc-context";
import {fetchActionQueue} from "../useCase/fetchActionQueue";
import {ActionQueue} from "../models/actionQueue";
import {showNotification} from "@mantine/notifications";


export const ActionQueueList: React.FC<{ fpfId: string}> = ({ fpfId }) => {
    const { t } = useTranslation();
    const auth = useAuth();
    const [queue, setQueue] = useState<ActionQueue[] | null>(null);

    useEffect(() => {
        if (fpfId && auth.isAuthenticated) {
            fetchActionQueue(fpfId).then((result) => {
                setQueue(result);
            }).catch((error) => {
                console.dir(error);
                showNotification({
                    title: t('common.loadError') + t('controllableActionList.queue.title'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [fpfId, auth.isAuthenticated, t]);

    return (
        <>
            <Group mb="md">
                <Title order={2}>{t('controllableActionList.queue.title')}</Title>
            </Group>
            {queue && queue.length > 0 ? (
                <Table striped highlightOnHover withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t("controllableActionList.name")}</Table.Th>
                                <Table.Th>{t("controllableActionList.trigger.description")}</Table.Th>
                                <Table.Th>{t("controllableActionList.hardware")}</Table.Th>
                                <Table.Th>{t("controllableActionList.queue.createdAt")}</Table.Th>
                                <Table.Th>{t("controllableActionList.queue.startedAt")}</Table.Th>
                                <Table.Th>{t("controllableActionList.queue.endedAt")}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            {queue.map((entry) => (
                                <Table.Tr>
                                    <Table.Td>{entry.controllableAction.name}</Table.Td>
                                    <Table.Td>{entry.actionTrigger.description}</Table.Td>
                                    <Table.Td>{entry.controllableAction.hardware?.name}</Table.Td>
                                    <Table.Td>{new Date(entry.createdAt).toLocaleString(navigator.language)}</Table.Td>
                                    <Table.Td>{entry.startedAt && new Date(entry.startedAt).toLocaleString(navigator.language)}</Table.Td>
                                    <Table.Td>{entry.endedAt && new Date(entry.endedAt).toLocaleString(navigator.language)}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
            ) : (
                <Text>{t("controllableActionList.queue.noEntriesFound")}</Text>
            )}
        </>
    );
};
