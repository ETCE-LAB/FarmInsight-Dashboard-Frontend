import React, {useEffect, useState} from "react";
import {LogMessage, ResourceType} from "../models/LogMessage";
import {getLogMessages} from "../useCase/getLogMessages";
import {Flex, Table, Text} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {getColorFromLogLevel} from "../../../utils/utils";
import TimeRangeSelector from "../../../utils/TimeRangeSelector";


export const LogMessageList: React.FC<{ resourceType: string, resourceId?: string }> = ({ resourceType, resourceId }) => {
    const [logMessages, setLogMessages] = React.useState<LogMessage[]>([]);
    const [dateRange, setDateRange] = useState<{from:string, to:string} | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        if (resourceId || (resourceType === ResourceType.ADMIN))
            getLogMessages(resourceType, resourceId, 10, dateRange?.from, dateRange?.to).then(resp => {
                setLogMessages(resp);
            });
    }, [resourceType, resourceId, dateRange]);

    return (
        <>
            {logMessages && (
              <>
                  <Flex>
                      <TimeRangeSelector onDateChange={setDateRange} defaultSelected={false}/>
                  </Flex>
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
                                  <Table.Td>{new Date(message.createdAt).toLocaleString(navigator.language)}</Table.Td>
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