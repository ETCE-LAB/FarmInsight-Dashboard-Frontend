import {AppShell, Card, Container, Flex, Group, Menu, rem, Skeleton, Text, TextInput} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {UserProfileComponent} from "../../../features/userProfile/ui/UserProfileComponent";
import {LoginButton} from "../../../features/auth/ui/loginButton";
import {LogoutButton} from "../../../features/auth/ui/logoutButton";
import {MainFrame} from "../mainFrame/mainFrame";
import {IconChevronDown} from "@tabler/icons-react";
import React, {PropsWithChildren, useState} from "react";
import * as child_process from "node:child_process";

export const BasicAppShell: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [opened, { toggle }] = useDisclosure();
    const [value, setValue] = useState('');

    //Dropdown menu for organizations
    const tabs = [
        { name: 'My Organizations', color: '#000000', link: './my-organizations', submenu: ['Organization 1', 'Organization 2', 'Organization 3'] },
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
                        <Menu.Item key={option} onClick={() => alert(`${option} clicked`)}>
                            {option}
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
                <Group h="100%" px="md">
                    <Flex justify={"space-between"} align={"center"}>
                        <Text style={{ display: 'flex', backgroundColor: '#105385', padding: '8px 16px', color: '#ffffff', borderRadius: '4px' }}>
                            FARM INSIGHT
                        </Text>
                        <Group>
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