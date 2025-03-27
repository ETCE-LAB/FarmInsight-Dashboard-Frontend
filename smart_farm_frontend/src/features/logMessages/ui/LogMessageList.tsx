import React, {useEffect} from "react";
import {LogMessage} from "../models/LogMessage";
import {getLogMessages} from "../useCase/getLogMessages";
import {Table, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getColorFromLogLevel} from "../../../utils/utils";


export const LogMessageList: React.FC<{ resourceType: string, resourceId?: string }> = ({ resourceType, resourceId }) => {
    const [logMessages, setLogMessages] = React.useState<LogMessage[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        if (resourceId)
            getLogMessages(resourceType, resourceId, 10).then(resp => {
                setLogMessages(resp);
            });
    }, [resourceType, resourceId]);

    return (
        <>
            {logMessages && (
              <>
                  <Table withColumnBorders>
                      <Table.Thead>
                          <Table.Tr>
                              <Table.Th>{t('log.created')}</Table.Th>
                              <Table.Th>{t('log.logLevel')}</Table.Th>
                              <Table.Th>{t('log.message')}</Table.Th>
                          </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                          {logMessages.map((message, index) => (
                              <Table.Tr key={index}>
                                  <Table.Td>{new Date(message.createdAt).toLocaleString()}</Table.Td>
                                  <Table.Td>
                                      <Text c={getColorFromLogLevel(message.logLevel)}>{message.logLevel}</Text>
                                  </Table.Td>
                                  <Table.Td>{message.message}</Table.Td>
                              </Table.Tr>
                          ))}
                      </Table.Tbody>
                  </Table>
              </>
            )}
        </>
    )
}