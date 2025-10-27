import {ResourceType} from "../../logMessages/models/LogMessage";
import React, {useEffect, useState} from "react";
import {getMyOrganizations} from "../../organization/useCase/getMyOrganizations";
import {useAuth} from "react-oidc-context";
import {Organization, OrganizationMembership} from "../../organization/models/Organization";
import {getOrganization} from "../../organization/useCase/getOrganization";
import {Button, Card, Container, Flex, Grid, Table, Title, HoverCard, Text} from "@mantine/core";
import {Fpf} from "../../fpf/models/Fpf";
import {getFpf} from "../../fpf/useCase/getFpf";
import {Sensor} from "../../sensor/models/Sensor";
import {LogMessageList} from "../../logMessages/ui/LogMessageList";
import {useTranslation} from "react-i18next";
import {formatFloatValue, getBackendTranslation, getSensorStateColor, getWsUrl} from "../../../utils/utils";
import useWebSocket from "react-use-websocket";
import {receiveUserProfile} from "../../userProfile/useCase/receiveUserProfile";
import {SystemRole} from "../../userProfile/models/UserProfile";
import {IconChevronDown, IconChevronRight, IconCircleFilled, IconSettings} from "@tabler/icons-react";
import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";
import {pingSensor} from "../useCase/ping";
import {showNotification} from "@mantine/notifications";
import {AppRoutes} from "../../../utils/appRoutes";
import {useNavigate} from "react-router-dom";
import {useInterval} from "@mantine/hooks";
import {AuthRoutes} from "../../../utils/Router";

export const StatusPage = () => {
    const auth = useAuth();
    const [organizations, setOrganizations] = useState<OrganizationMembership[]>([]);
    const { t, i18n } = useTranslation();
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            receiveUserProfile().then((user) => {
                setIsAdmin(user.systemRole === SystemRole.ADMIN);
            }).catch((error) => {
               showNotification({
                   title: t('common.loadError'),
                   message: `${error}`,
                   color: 'red',
               })
            });

            getMyOrganizations().then(orgs => {
                if (orgs) setOrganizations(orgs)
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                })
            });
        } else {
            navigate(AuthRoutes.signin);
        }
    }, [auth.isAuthenticated, t, navigate]);

    const SensorOverview: React.FC<{sensor: Sensor}> = ({sensor})=> {
        let { lastMessage } = useWebSocket(`${getWsUrl()}/ws/sensor/${sensor?.id}`);
        const [statusColor, setStatusColor] = useState(getSensorStateColor(new Date(sensor.lastMeasurement.measuredAt), sensor.isActive, sensor.intervalSeconds));
        const [measuredAt, setMeasuredAt] = useState(new Date(sensor.lastMeasurement.measuredAt));
        const [isActive, setIsActive] = useState(sensor.isActive);
        const [lastValue, setLastValue] = useState<string>(formatFloatValue(sensor.lastMeasurement?.value));
        const [currentlyPinging, setCurrentlyPinging] = useState(false);
        useInterval(() => setStatusColor(getSensorStateColor(measuredAt, isActive, sensor.intervalSeconds)), Math.min((sensor.intervalSeconds / 2) * 1000, 10 * 1000), { autoInvoke: true });

        useEffect(() => {
            if (!lastMessage) return;
            try {
                const data = JSON.parse(lastMessage.data);
                const newDate = new Date(data.measurement.at(-1).measuredAt);
                // we don't get a full on sensor changed message, but if it receives values it is clearly active
                // this won't realize when it gets turned off but there's no mechanism for that and won't really be noticed
                setStatusColor(getSensorStateColor(newDate, true, sensor.intervalSeconds));
                setIsActive(true);
                setMeasuredAt(newDate);
                setLastValue(data.measurement.at(-1).value);
            } catch (err) {
                console.error("Error processing WebSocket message:", err);
            }
        }, [lastMessage, sensor.intervalSeconds]);

        const getSensorPing = () => {
            if (currentlyPinging) return;
            setCurrentlyPinging(true);

            pingSensor(sensor.id).then((result) => {
                showNotification({
                    title: t('overview.pingResult'),
                    message: `${JSON.stringify(result)}`,
                    color: 'green',
                });
            }).catch((err) => {
                showNotification({
                    title: t('overview.pingResult'),
                    message: `${err}`,
                    color: 'red',
                });
            }).finally(()=> {
                setCurrentlyPinging(false);
            });
        }

        return (
            <Table.Tr>
                <Table.Td>{getBackendTranslation(sensor.name, i18n.language)}</Table.Td>
                <Table.Td>
                    <Flex align="center" gap="xs">
                        <HoverCard>
                            <HoverCard.Target>
                                <IconCircleFilled size={20} color={statusColor} />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">{t('sensorList.intervalSeconds')}: {sensor.intervalSeconds}</Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Flex>
                </Table.Td>
                <Table.Td>{measuredAt.toLocaleString(navigator.language)}</Table.Td>
                <Table.Td>{lastValue}{sensor.unit}</Table.Td>
                <Table.Td><LogMessageModalButton resourceType={ResourceType.SENSOR} resourceId={sensor.id} /></Table.Td>
                <Table.Td><Button onClick={getSensorPing} variant="default" disabled={currentlyPinging}>{t('header.ping')}</Button></Table.Td>
            </Table.Tr>
        )
    } 
    
    const FpfOverview: React.FC<{orgId: string, id: string}> = ({orgId, id})=> {
        const [fpf, setFpf] = useState<Fpf>();
        useEffect(() => {
            getFpf(id).then(f => {
                setFpf(f);
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                })
            });
        }, [id]);

        return (
            <>
                {fpf &&
                    <Card withBorder miw="50ch">
                        <Flex justify="space-between" mb="md">
                            <Title order={3}> {fpf.name} </Title>
                            <Flex align="center" gap="xs">
                                <IconSettings
                                    size={20}
                                    style={{ cursor: "pointer" }}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        navigate(
                                            AppRoutes.editFpf
                                                .replace(":organizationId", orgId)
                                                .replace(":fpfId", fpf.id)
                                        );
                                    }}
                                />
                                <LogMessageModalButton resourceType={ResourceType.FPF} resourceId={fpf.id} />
                            </Flex>
                        </Flex>
                        <Table withColumnBorders>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t('sensorList.name')}</Table.Th>
                                    <Table.Th>{t('header.status')}</Table.Th>
                                    <Table.Th>{t('sensor.lastMeasurementAt')}</Table.Th>
                                    <Table.Th>{t('sensor.lastValue')}</Table.Th>
                                    <Table.Th>{t('log.showMessages')}</Table.Th>
                                    <Table.Th>{t('header.ping')}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {fpf.Sensors.map(sensor =>
                                    <SensorOverview sensor={sensor} key={sensor.id} />
                                )}
                            </Table.Tbody>
                        </Table>
                    </Card>
                }
            </>
        )
    }

    const OrgOverview: React.FC<{id: string}> = ({id}) => {
        const [organization, setOrganization] = useState<Organization>();
        useEffect(() => {
            getOrganization(id).then(org => {
                setOrganization(org);
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                })
            });
        }, [id]);

        const [show, setShow] = useState(true);

        return (
            <>
                {organization &&
                    <Card>
                        <Flex justify="space-between">
                            <Flex align="center" gap="xs">
                                <Button variant="subtle" size="xs" onClick={() => setShow(!show)}>
                                    {show ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                                </Button>
                                <Title order={2}> {organization.name} </Title>
                            </Flex>
                            <Flex align="center" gap="xs">
                                <IconSettings
                                    size={24}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            AppRoutes.organization.replace(
                                                ":organizationId",
                                                organization.id
                                            )
                                        )
                                    }
                                />
                                <LogMessageModalButton resourceType={ResourceType.ORGANIZATION} resourceId={organization.id} />
                            </Flex>
                        </Flex>
                        {show &&
                            <Flex gap="lg" mt="lg" flex={1} wrap='wrap' w='100%'>
                                {organization.FPFs.map(fpf =>
                                    <FpfOverview orgId={organization.id} id={fpf.id} key={fpf.id} />
                                )}
                            </Flex>
                        }
                    </Card>
                }
            </>
        )
    }

    const SystemMessageView: React.FC = () => {
        const [showMessages, setShowMessages] = useState(false);

        return (
            <>
                {isAdmin &&
                    <Card mt="lg">
                        <Flex gap="lg" align="center" mb={showMessages ? 'md' : ''}>
                            <Button variant="subtle" size="xs" onClick={() => setShowMessages(!showMessages)}>
                                {showMessages ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                            </Button>
                            <Title order={1}>{t('log.systemMessages')}</Title>
                        </Flex>
                        {showMessages &&
                            <LogMessageList resourceType={ResourceType.ADMIN} />
                        }
                    </Card>
                }
            </>
        )
    }
    const [showOverview, setShowOverview] = useState(true);

    return (
        <Container fluid>
            <Card>
                <Flex justify="space-between">
                    <Flex gap="lg" align="center">
                        <Button variant="subtle" size="xs" onClick={() => setShowOverview(!showOverview)}>
                            {showOverview ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                        </Button>
                        <Title order={1}>{t('header.statusOverview')}</Title>
                    </Flex>
                    {showOverview &&
                        <Flex gap='lg' justify="end" mr="md">
                            <Flex gap="sm" align="center">
                                <IconCircleFilled size={20} color="green" /> {t("overview.green")}
                            </Flex>
                            <Flex gap="sm" align="center">
                                <IconCircleFilled size={20} color="yellow" /> {t('overview.yellow')}
                            </Flex>
                            <Flex gap="sm" align="center">
                                <IconCircleFilled size={20} color="red" /> {t('overview.red')}
                            </Flex>
                            <Flex gap="sm" align="center">
                                <IconCircleFilled size={20} color="grey" /> {t('overview.grey')}
                            </Flex>
                        </Flex>
                    }
                </Flex>
                {showOverview &&
                    <Grid grow gutter='lg' mt='lg'>
                        {organizations && (organizations.map(org =>
                            <OrgOverview id={org.id} key={org.id} />
                        ))}
                    </Grid>
                }
            </Card>
            <SystemMessageView />
        </Container>
    );
}