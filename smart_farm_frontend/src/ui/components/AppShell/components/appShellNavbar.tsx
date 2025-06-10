import React, { useState, useEffect } from "react";
import { Container, Menu, Text, Flex, Divider, Modal, Paper, useMantineTheme } from "@mantine/core";
import { IconSettings, IconSquareRoundedPlus } from "@tabler/icons-react";
import { OrganizationMembership } from "../../../../features/organization/models/Organization";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../../utils/appRoutes";
import { getMyOrganizations } from "../../../../features/organization/useCase/getMyOrganizations";
import { useAuth } from "react-oidc-context";
import { Fpf } from "../../../../features/fpf/models/Fpf";
import { getOrganization } from "../../../../features/organization/useCase/getOrganization";
import DynamicFontText from "../../../../utils/DynamicFontText";
import { useTranslation } from "react-i18next";
import { FpfForm } from "../../../../features/fpf/ui/fpfForm";

export const AppShellNavbar: React.FC<{onNavbarShouldClose: () => void}> = ({onNavbarShouldClose}) => {
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const [selectedOrganization, setSelectedOrganization] = useState<{
        name: string;
        id: string;
    }>({ name: t("header.myOrganizations"), id: "" });
    const [organizations, setMyOrganizations] = useState<OrganizationMembership[]>([]);
    const [selectedFPFId, setSelectedFPFId] = useState<string | null>(null);
    const [organizationId, setOrganizationId] = useState<string>();
    const [fpfList, setFpfList] = useState<Fpf[]>([]);
    const [fpfModalOpen, setFpfModalOpen] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (auth.isAuthenticated) {
            getMyOrganizations().then((resp) => {
                if (resp) setMyOrganizations(resp);
            });
        }
    }, [auth.isAuthenticated]);

    useEffect(() => {
        if (auth.isAuthenticated) {
            const path = location.pathname.split("/");
            const organizationPathIndex = path.indexOf("organization");
            if (organizationPathIndex !== -1 && path.length > organizationPathIndex + 1) {
                const orgId = path[organizationPathIndex + 1];
                setOrganizationId(orgId);
                getOrganization(orgId).then((resp) => {
                    if (resp) {
                        setFpfList(resp.FPFs);
                        setSelectedOrganization({ name: resp.name, id: resp.id });
                        const fpfPathIndex = path.indexOf("fpf");
                        if (fpfPathIndex !== -1 && path.length > fpfPathIndex + 1) {
                            const fpfId = path[fpfPathIndex + 1];
                            setSelectedFPFId(fpfId);
                        }
                    }
                });
            } else {
                setSelectedFPFId(null);
                setFpfList([]);
                setSelectedOrganization({ name: t("header.myOrganizations"), id: "" });
                getMyOrganizations().then((resp) => {
                    if (resp) setMyOrganizations(resp);
                });
            }
        }
    }, [location, t, auth.isAuthenticated]);

    const handleOrganizationSelect = (name: string, id: string) => {
        setSelectedOrganization({ name, id });
        navigate(AppRoutes.organization.replace(":organizationId", id));
        onNavbarShouldClose();
    };

    const handleFpfSelect = (id: string) => {
        navigate(
            AppRoutes.displayFpf
                .replace(":organizationId", selectedOrganization.id)
                .replace(":fpfId", id)
        );
        onNavbarShouldClose();
    };

    return (
        <Container fluid w="100%" p="0">
            {/* FpF Modal */}
            <Modal centered
                opened={fpfModalOpen}
                onClose={() => setFpfModalOpen(false)}
                title={t("header.addFpf")}
            >
                <FpfForm organizationId={organizationId} close={setFpfModalOpen} />
            </Modal>

            {/* Header */}
            <Flex align="center" justify="space-between" p="1rem 2rem .8rem 2rem">
                <Menu
                    trigger="hover"
                    openDelay={100}
                    closeDelay={100}
                    withinPortal
                >
                    <Menu.Target>
                        <Text size="xl" fw="600" style={{ cursor: 'pointer' }}>
                            {selectedOrganization.name}
                        </Text>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {organizations.map((org) => (
                            <Menu.Item key={org.id} onClick={() => handleOrganizationSelect(org.name, org.id)}>
                                {org.name}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
                <IconSettings
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                            navigate(
                                AppRoutes.organization.replace(
                                    ":organizationId",
                                    selectedOrganization.id
                                )
                            );
                            onNavbarShouldClose();
                        }
                    }
                />
            </Flex>

            <Divider my="sm" />

            {/* FpF List */}
            <Container p="0 1rem">
                {fpfList.map((fpf) => (
                    <Paper key={fpf.id} radius="md" mb="1rem" p="0.75rem 1rem"
                        style={{
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                            ...(fpf.id === selectedFPFId
                                ? { backgroundColor: "rgba(240, 240, 240, 0.2)" }
                                : {}),
                        }}
                        onClick={() => handleFpfSelect(fpf.id)}
                    >
                        <Flex align="center" justify="space-between">
                            <DynamicFontText text={fpf.name} maxWidth={150} />
                            <IconSettings
                                size={20}
                                style={{ cursor: "pointer" }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    navigate(
                                        AppRoutes.editFpf
                                            .replace(":organizationId", selectedOrganization.id)
                                            .replace(":fpfId", fpf.id)
                                    );
                                    onNavbarShouldClose();
                                }}
                            />
                        </Flex>
                    </Paper>
                ))}
                <Flex align="center" justify="center" mt="md" gap="xs">
                    <Divider style={{ flexGrow: 1 }} />
                    <IconSquareRoundedPlus
                        title={t("header.addFpf")}
                        style={{ cursor: "pointer" }}
                        size={30}
                        stroke={2}
                        color={theme.colors.blue[6]}
                        onClick={() => setFpfModalOpen(true)}
                    />
                    <Divider style={{ flexGrow: 1 }} />
                </Flex>
            </Container>
        </Container>
    );
};
