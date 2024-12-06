import React, {useState, useEffect, useRef} from "react";
import { Container, Menu, TextInput, Text, List, Flex} from '@mantine/core';
import {IconSettings, IconChevronDown, IconCircleCheck, IconCircleMinus, IconSearch} from "@tabler/icons-react";
import { rem, Divider } from "@mantine/core";
import { Organization } from "../../../../features/organization/models/Organization";
import {useLocation, useNavigate} from "react-router-dom";
import { AppRoutes } from "../../../../utils/appRoutes";
import { getMyOrganizations } from "../../../../features/organization/useCase/getMyOrganizations";
import { useAuth } from "react-oidc-context";
import {Fpf} from "../../../../features/fpf/models/Fpf";
import {getOrganization} from "../../../../features/organization/useCase/getOrganization";
import DynamicFontText from "../../../../utils/DynamicFontText";

export const AppShell_Navbar: React.FC = () => {
    const [value, setValue] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState<{
        name: string,
        id: string
    }>({name: 'My Organizations', id: ''});
    const [organizations, setMyOrganizations] = useState<Organization[]>([]);
    const [selectedFPFId, setSelectedFPFId] = useState<string | null>(null);
    const [fpfList, setFpfList] = useState<Fpf[]>([])

    const navigate = useNavigate();
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (auth.isAuthenticated) {
            getMyOrganizations().then(resp => {
                if (resp) setMyOrganizations(resp);
            });
        }
    }, [auth.user]);

    useEffect(() => {
        if (auth.isAuthenticated) {
            const path = location.pathname.split('/');
            const organizationPathIndex = path.indexOf('organization');
            if (organizationPathIndex !== -1 && path.length > organizationPathIndex + 1) {
                const organizationId = path[organizationPathIndex + 1];
                getOrganization(organizationId).then(resp => {
                    if (resp) {
                        setFpfList(resp.FPFs)
                        setSelectedOrganization({name: resp.name, id: resp.id});

                        const fpfPathIndex = path.indexOf('fpf');
                        if (fpfPathIndex !== -1 && path.length > fpfPathIndex + 1) {
                            const fpfId = path[fpfPathIndex + 1];
                            setSelectedFPFId(fpfId);
                        }
                    }
                })
            } else {
                setSelectedFPFId(null);
                setFpfList([]);
                setSelectedOrganization({name: 'My Organizations', id: ''});
                getMyOrganizations().then(resp => {
                    if (resp) setMyOrganizations(resp);
                });
            }
        }
    }, [location]);

    const tabs = [
        {
            org: selectedOrganization,
            link: './my-organizations',
            submenu: organizations.map((org) => ({name: org.name, id: org.id})),
        },
    ];

    const handleOrganizationSelect = (name: string, id: string) => {
        setSelectedOrganization({name, id});
        navigate(AppRoutes.organization.replace(':organizationId', id));
    };

    const handleFpfSelect = (id: string) => {
        navigate(AppRoutes.displayFpf.replace(':organizationId', selectedOrganization.id).replace(':fpfId', id));
    }

        const items = tabs.map((tab) => (
            <Flex key={tab.org.name} style={{margin: "auto", width: '100%'}}>
                <Menu trigger="hover" openDelay={100} closeDelay={100} withinPortal>
                    <Menu.Target>
                        <Flex style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                            <Text style={{display: 'flex', margin: 'auto', alignItems: 'center'}}>
                                <DynamicFontText text={tab.org.name} maxWidth={160} />
                            </Text>
                            <IconChevronDown
                                style={{width: '16px', height: '16px', marginRight: '5px', display: 'flex'}}
                                stroke={2}
                            />
                        </Flex>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {tab.submenu.map((option) => (
                            <Menu.Item
                                key={option.id}
                                onClick={() => handleOrganizationSelect(option.name, option.id)}
                            >
                                {option.name}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            </Flex>
        ));

        return (
            <Container size="fluid" style={{display: 'flex', flexDirection: 'column', width: '100%', padding: '0'}}>
                <Flex
                    style={{

                        marginTop: '1vh',
                        width: '100%',
                        alignItems: 'center',
                        padding: '5px'
                    }}
                >
                    <IconSettings
                        size={20}
                        style={{
                            cursor: 'pointer',
                            float: 'left',
                        }}
                        stroke={2}
                        onClick={() =>
                            navigate(AppRoutes.organization.replace(':organizationId', selectedOrganization.id))
                        }
                    />
                    <Flex justify="center" style={{width: '100%'}}>{items}</Flex>

                </Flex>

                <Divider my="sm" style={{width: '100%'}}/>

                <TextInput
                    variant="unstyled"
                    style={{
                        marginBottom: '2vh',
                        width: '100%',
                    }}
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    placeholder="Search FPFs.."
                    leftSection={<IconSearch style={{ width: '16px', height: '16px', color: '#ccc' }} />}
                />

                <Container size={"xl"} style={{width: '100%', padding: '0'}}>
                    {fpfList &&
                        fpfList
                            .filter((fpf) =>
                                fpf.name.toLowerCase().includes(value.toLowerCase())
                            )
                            .map((fpf, index) => (
                                <Flex
                                    key={index}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor:
                                            selectedFPFId === fpf.id ? 'rgba(255, 255, 255, 0.1)' : '',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        border: 'none',
                                        display: 'flex',
                                        paddingTop: '1vh',
                                        paddingBottom: '1vh',
                                        marginBottom: '16px',
                                        listStyleType: 'none',
                                    }}
                                    onClick={() => {
                                        handleFpfSelect(fpf.id);
                                    }}
                                >
                                    <Text

                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: selectedFPFId === fpf.id ? '#199ff4' : '',


                                            paddingLeft: '5px',
                                            paddingRight: '5px',

                                        }}
                                    >
                                        {selectedFPFId === fpf.id ? (
                                            <IconCircleCheck
                                                size={20}

                                                style={{marginRight: '5px', color: '#16A34A',verticalAlign: 'middle',}}
                                            />
                                        ) : (
                                            <IconCircleMinus
                                                size={20}
                                                style={{marginRight: '5px', color: '#D97400', verticalAlign: 'middle',}}
                                            />
                                        )}
                                        <Flex
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                }}
                                            >
                                         <DynamicFontText text={fpf.name} maxWidth={150} />
                                        </Flex>
                                        </Text>
                                        <IconSettings
                                            size={20}

                                            style={{
                                                verticalAlign: 'middle',
                                                display: 'flex',
                                                marginLeft: 'auto',
                                                marginRight: '5px'
                                            }}
                                            stroke={2}
                                            cursor="pointer"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(
                                                    AppRoutes.editFpf
                                                        .replace(':organizationId', selectedOrganization.id)
                                                        .replace(':fpfId', fpf.id)
                                                );
                                            }}
                                        />

                                </Flex>
                            ))}
                </Container>
            </Container>
        );
    }
