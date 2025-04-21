import {ResourceType} from "../../logMessages/models/LogMessage";
import React, {useEffect, useState} from "react";
import {getMyOrganizations} from "../../organization/useCase/getMyOrganizations";
import {useAuth} from "react-oidc-context";
import {Organization} from "../../organization/models/Organization";
import {getOrganization} from "../../organization/useCase/getOrganization";
import {Badge, Card, Container, Flex, Table, Title} from "@mantine/core";
import {Fpf} from "../../fpf/models/Fpf";
import {getFpf} from "../../fpf/useCase/getFpf";
import {Sensor} from "../../sensor/models/Sensor";
import {LogMessageList} from "../../logMessages/ui/LogMessageList";
import {useTranslation} from "react-i18next";
import {getIsoStringFromDate, getSensorStateColor, getWsUrl} from "../../../utils/utils";
import useWebSocket from "react-use-websocket";

export const StatusPage = () => {
    const auth = useAuth();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (auth.isAuthenticated) {
            getMyOrganizations().then(orgs => {
                if (orgs !== undefined)
                    setOrganizations(orgs)
            })
        }
    },[auth.isAuthenticated]);

    const SensorOverview: React.FC<{sensor: Sensor}> = ({sensor})=> {
        let { lastMessage } = useWebSocket(`${getWsUrl()}/ws/sensor/${sensor?.id}`);
        const [statusColor, setStatusColor] = useState(getSensorStateColor(new Date(sensor.lastMeasurement.measuredAt), sensor.isActive, sensor.intervalSeconds));
        const [measuredAt, setMeasuredAt] = useState(new Date(sensor.lastMeasurement.measuredAt));
        const [isActive, setIsActive] = useState(sensor.isActive);

        useEffect(() => {
            if (!lastMessage) return;
            try {
                const data = JSON.parse(lastMessage.data);
                const newDate = new Date(data.measurement.at(-1).measuredAt);
                // we don't get a full on sensor changed message, but if it receives values it is clearly active
                // this won't realize when it gets turned off but there's no mechanism for that and won't really be noticed
                setStatusColor(getSensorStateColor(newDate, true, sensor.intervalSeconds));
                setMeasuredAt(newDate);
                setIsActive(true);
            } catch (err) {
                console.error("Error processing WebSocket message:", err);
            }
        }, [lastMessage]);

        return (
            <Table.Tr>
                <Table.Td>{sensor.name}</Table.Td>
                <Table.Td><Badge color={statusColor}>{!isActive && (<>{t("camera.inactive")}</>)}</Badge></Table.Td>
                <Table.Td>{measuredAt.toLocaleString(navigator.language)}</Table.Td>
            </Table.Tr>
        )
    } 
    
    const FpfOverview: React.FC<{id: string}> = ({id})=> {
        const [fpf, setFpf] = useState<Fpf>();
        useEffect(() => {
            getFpf(id).then(f => {
                setFpf(f);
            })
        }, [id]);

        return (
            <Card withBorder>
                {fpf &&
                    <>
                        <Title order={3}> {fpf.name} </Title>
                        <Table withColumnBorders>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t('sensorList.name')}</Table.Th>
                                    <Table.Th>{t('header.status')}</Table.Th>
                                    <Table.Th>{t('sensor.lastMeasurementAt')}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {fpf.Sensors.map(sensor =>
                                    <SensorOverview sensor={sensor} />
                                )}
                            </Table.Tbody>
                        </Table>
                    </>
                }
            </Card>
        )
    }

    const OrgOverview: React.FC<{id: string}> = ({id}) => {
        const [organization, setOrganization] = useState<Organization>();
        useEffect(() => {
            getOrganization(id).then(org => {
                setOrganization(org);
            })
        }, [id]);

        return (
            <Card >
                {organization &&
                    <>
                        <Title order={2}> {organization.name} </Title>
                        <Flex gap="lg" mt="lg">
                            {organization.FPFs.map(fpf =>
                                <FpfOverview id={fpf.id} />
                            )}
                        </Flex>
                    </>}
            </Card>
        )
    }

    return (
        <Container size="xl">
            <Card>
                <Title order={2}>{t('log.systemMessages')}</Title>
                <LogMessageList resourceType={ResourceType.ADMIN} />
            </Card>
            <Flex mt="lg" gap="lg" direction='column'>
                {organizations && (organizations.map(org =>
                    <OrgOverview id={org.id} />
                ))}
                <Flex gap='lg' justify="end" mr="md">
                    <Flex gap="sm" align="center">
                        <Badge color="green"></Badge> {t('overview.green')}
                    </Flex>
                    <Flex gap="sm" align="center">
                        <Badge color="yellow"></Badge> {t('overview.yellow')}
                    </Flex>
                    <Flex gap="sm" align="center">
                        <Badge color="red"></Badge> {t('overview.red')}
                    </Flex>
                </Flex>
            </Flex>
        </Container>
    );
}