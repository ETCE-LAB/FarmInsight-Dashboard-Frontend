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
import {getIsoStringFromDate, getSensorStateColor} from "../../../utils/utils";

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
        return (
            <Table.Tr>
                <Table.Td>{sensor.name}</Table.Td>
                <Table.Td><Badge color={getSensorStateColor(sensor)}>{!sensor.isActive && (<>{t("camera.inactive")}</>)}</Badge></Table.Td>
                <Table.Td>{getIsoStringFromDate(new Date(sensor.lastMeasurement.measuredAt))}</Table.Td>
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
            </Flex>
        </Container>
    );
}