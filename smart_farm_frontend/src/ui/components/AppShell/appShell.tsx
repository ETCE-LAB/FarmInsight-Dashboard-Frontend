import {AppShell, Card, Container, Flex, Group, Menu, rem, Text, TextInput} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {UserProfileComponent} from "../../../features/userProfile/ui/UserProfileComponent";
import {LoginButton} from "../../../features/auth/ui/loginButton";
import {LogoutButton} from "../../../features/auth/ui/logoutButton";
import {IconChevronDown} from "@tabler/icons-react";
import React, {PropsWithChildren, useContext, useEffect, useState} from "react";
import {getMyOrganizations} from "../../../features/organization/useCase/getMyOrganizations";
import {Organization} from "../../../features/organization/models/Organization";
import {useAuth} from "react-oidc-context";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";
import {AppRoutes} from "../../../utils/appRoutes";
import {useNavigate} from "react-router-dom";
import {SocketContext} from "../../../utils/Context";

export const BasicAppShell: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [opened, { toggle }] = useDisclosure();
    const [value, setValue] = useState('');
    const auth = useAuth()
    const navigate = useNavigate()
    const [organizations, setMyOrganisations] = useState<Organization[]>([])
    const organizationEventListener = useSelector((state: RootState) => state.organization.createdOrganizationEvent);
    const socket = useContext(SocketContext)


    useEffect(() => {
        if(auth.isAuthenticated) {
            getMyOrganizations().then(resp => {
                setMyOrganisations(resp)
            })
        }
    }, [auth.user, organizationEventListener]);

    useEffect(() => {
        if(auth.isAuthenticated) {
            socket.on('CreatedOrganisation', (data) => {
                getMyOrganizations().then(resp => setMyOrganisations(resp))
            })
        }

        return () => {
            socket.off("CreatedOrganisation")
        }
    }, [socket]);



    //Dropdown menu for organizations
    const tabs = [
        { name: 'My Organizations',
            color: '#000000',
            link: './my-organizations',
            submenu: organizations.map((org) => ({ name: org.name, link: `./organization/${org.id}` })) },
    ];

    const handleTabClick = (link = '/') => {
        if (link) {
            console.log(link);
        } else {
            console.warn('No link provided for this tab.');
        }
    };

    const items = tabs.map((tab) => (
        <div key={tab.name} style={{ marginBottom: '20px' }}>
            <Menu trigger="hover" openDelay={100} closeDelay={100} withinPortal>
                <Menu.Target>
                    <Text onClick={() => handleTabClick(tab.link)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                        {tab.name}
                        <IconChevronDown style={{ width: rem(16), height: rem(16) }} stroke={2} />
                    </Text>
                </Menu.Target>
                <Menu.Dropdown>
                    {tab.submenu.map((option) => (
                        <Menu.Item key={option.link} onClick={() => alert(`${option.name} clicked`)}>
                            {option.name}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </div>
    ));

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: "15vw", breakpoint: 'sm'}}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" style={{ width: '100%' }}>
                    <Flex w="100%" justify="space-between" align="center">
                        <Card
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            style={{
                                cursor: 'pointer',
                                backgroundColor: '#105385',
                            }}
                            onClick={() => navigate(AppRoutes.base)}
                        >
                            <Card.Section>
                                <Text style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '8px 16px',
                                    fontSize: '20px',
                                    fontFamily: 'Open Sans, sans-serif',
                                    fontWeight: 'bold',
                                }}>
                                    FARM INSIGHT
                                </Text>
                            </Card.Section>
                        </Card>
                        <Group gap="md">
                            <UserProfileComponent />
                            <LoginButton />
                            <LogoutButton />
                        </Group>
                    </Flex>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Container size="sm" >
                        {items}
                        <TextInput style={{ marginBottom: '20px' }} value={value} onChange={(event) => setValue(event.currentTarget.value)} placeholder="Search name" />
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{ margin: '16px', cursor: 'pointer' }}
                    >
                        <Card.Section>
                            <Text style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '8px 16px',
                                color: '#105385',
                                fontSize: '30px',
                            }}>
                                FPF 1
                            </Text>
                        </Card.Section>
                    </Card>
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{ margin: '16px', cursor: 'pointer' }}
                    >
                        <Card.Section>
                            <Text style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '8px 16px',
                                color: '#105385',
                                fontSize: '30px',
                            }}>
                                FPF 2
                            </Text>
                        </Card.Section>
                    </Card>
                </Container>
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}