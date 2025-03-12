import React, { useState, useEffect } from "react";
import { Container, Menu, TextInput, Text, Flex, Divider, Modal } from '@mantine/core';
import {
    IconSettings,
    IconSearch,
    IconSquareRoundedPlus
} from "@tabler/icons-react";
import { Organization } from "../../../../features/organization/models/Organization";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../../utils/appRoutes";
import { getMyOrganizations } from "../../../../features/organization/useCase/getMyOrganizations";
import { useAuth } from "react-oidc-context";
import { Fpf } from "../../../../features/fpf/models/Fpf";
import { getOrganization } from "../../../../features/organization/useCase/getOrganization";
import DynamicFontText from "../../../../utils/DynamicFontText";
import { useTranslation } from 'react-i18next';
import { FpfForm } from "../../../../features/fpf/ui/fpfForm";
import { useMediaQuery } from '@mantine/hooks'; // Für media query

export const AppShellNavbar: React.FC = () => {
    const [value, setValue] = useState('');
    const { t } = useTranslation();
    const [selectedOrganization, setSelectedOrganization] = useState<{ name: string, id: string }>({ name: t("header.myOrganizations"), id: '' });
    const [organizations, setMyOrganizations] = useState<Organization[]>([]);
    const [selectedFPFId, setSelectedFPFId] = useState<string | null>(null);
    const [fpfList, setFpfList] = useState<Fpf[]>([]);
    const [drawerOpened, setDrawerOpened] = useState(false); // Für das Burger Menü

    const navigate = useNavigate();
    const auth = useAuth();
    const location = useLocation();

    const [organizationId, setOrganizationId] = useState<string>();
    const isMobile = useMediaQuery('(max-width: 768px)'); // Media query für mobile Geräte

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
                setOrganizationId(organizationId);
                getOrganization(organizationId).then(resp => {
                    if (resp) {
                        setFpfList(resp.FPFs);
                        setSelectedOrganization({ name: resp.name, id: resp.id });

                        const fpfPathIndex = path.indexOf('fpf');
                        if (fpfPathIndex !== -1 && path.length > fpfPathIndex + 1) {
                            const fpfId = path[fpfPathIndex + 1];
                            setSelectedFPFId(fpfId);
                        }
                    }
                });
            } else {
                setSelectedFPFId(null);
                setFpfList([]);
                setSelectedOrganization({ name: t("header.myOrganizations"), id: '' });
                getMyOrganizations().then(resp => {
                    if (resp) setMyOrganizations(resp);
                });
            }
        }
    }, [location, t, auth.isAuthenticated]);

    const handleOrganizationSelect = (name: string, id: string) => {
        setSelectedOrganization({ name, id });
        navigate(AppRoutes.organization.replace(":organizationId", id));
    };

    const handleFpfSelect = (id: string) => {
        navigate(AppRoutes.displayFpf.replace(':organizationId', selectedOrganization.id).replace(':fpfId', id));
    };

    return (
        <Container size="fluid" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0' }}>
            {/* FpF Modal */}
            <Modal
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                centered
            >
                <FpfForm organizationId={organizationId} close={setDrawerOpened} />
            </Modal>

            <Flex
                style={{
                    marginTop: '1vh',
                    width: '100%',
                    alignItems: 'center',
                    padding: '5px'
                }}
            >
            <>
                {/* Desktop Ansicht */}
                <IconSettings
                    size={20}
                    style={{
                        cursor: 'pointer',
                        float: 'left',
                    }}
                    stroke={2}
                    onClick={() => navigate(AppRoutes.organization.replace(':organizationId', selectedOrganization.id))}
                />
                <Flex justify="center" style={{ width: '100%' }}>
                    {organizations.map((org) => (
                        <Menu key={org.id} trigger="hover" openDelay={100} closeDelay={100} withinPortal>
                            <Menu.Target>
                                <Text style={{ margin: 'auto', cursor: 'pointer' }}>{org.name}</Text>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => handleOrganizationSelect(org.name, org.id)}>
                                    {org.name}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    ))}
                </Flex>
            </>

            </Flex>

            {!isMobile && <Divider my="sm" style={{ width: '100%' }} />}

            {!isMobile && (
                <TextInput
                    variant="unstyled"
                    style={{
                        marginBottom: '2vh',
                        width: '100%',
                    }}
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    placeholder={t("header.search")}
                    leftSection={<IconSearch style={{ width: '16px', height: '16px', color: '#ccc' }} />}
                />
            )}

            <Container size={"xl"} style={{ width: '100%', padding: '0' }}>
                {fpfList
                    .filter((fpf) => fpf.name.toLowerCase().includes(value.toLowerCase()))
                    .map((fpf, index) => (
                        <Flex
                            key={index}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedFPFId === fpf.id ? 'rgba(255, 255, 255, 0.1)' : '',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                paddingTop: '1vh',
                                paddingBottom: '1vh',
                                marginBottom: '16px',
                            }}
                            onClick={() => handleFpfSelect(fpf.id)}
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
                                <IconSettings
                                    size={22}
                                    style={{
                                        verticalAlign: 'middle',
                                        display: 'flex',
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
                        </Flex>
                    ))}
                <Flex style={{ width: '100%', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <Divider style={{ flexGrow: 1 }} />
                    <IconSquareRoundedPlus
                        title={t("header.addFpf")}
                        style={{ cursor: 'pointer' }}
                        size={30}
                        stroke={2}
                        color={"#199ff4"}
                        onClick={() => setDrawerOpened(true)}
                    />
                    <Divider style={{ flexGrow: 1 }} />
                </Flex>
            </Container>
        </Container>
    );
};
