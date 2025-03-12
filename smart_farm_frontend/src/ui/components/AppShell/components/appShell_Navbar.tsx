import React, { useState, useEffect } from "react";
import {
    Container,
    Menu,
    TextInput,
    Text,
    Flex,
    Divider,
    Modal,
    Button,
    Paper,
    Group,
    useMantineTheme,
} from "@mantine/core";
import {
    IconSettings,
    IconSearch,
    IconSquareRoundedPlus,
} from "@tabler/icons-react";
import { Organization } from "../../../../features/organization/models/Organization";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../../utils/appRoutes";
import { getMyOrganizations } from "../../../../features/organization/useCase/getMyOrganizations";
import { useAuth } from "react-oidc-context";
import { Fpf } from "../../../../features/fpf/models/Fpf";
import { getOrganization } from "../../../../features/organization/useCase/getOrganization";
import DynamicFontText from "../../../../utils/DynamicFontText";
import { useTranslation } from "react-i18next";
import { FpfForm } from "../../../../features/fpf/ui/fpfForm";
import { useMediaQuery } from "@mantine/hooks";

export const AppShell_Navbar: React.FC = () => {
    const theme = useMantineTheme();
    const [searchValue, setSearchValue] = useState("");
    const { t } = useTranslation();
    const [selectedOrganization, setSelectedOrganization] = useState<{
        name: string;
        id: string;
    }>({ name: t("header.myOrganizations"), id: "" });
    const [organizations, setMyOrganizations] = useState<Organization[]>([]);
    const [selectedFPFId, setSelectedFPFId] = useState<string | null>(null);
    const [fpfList, setFpfList] = useState<Fpf[]>([]);
    const [fpfModalOpen, setFpfModalOpen] = useState(false);
    const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false); // New state for mobile navbar toggle

    const navigate = useNavigate();
    const auth = useAuth();
    const location = useLocation();
    const [organizationId, setOrganizationId] = useState<string>();
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        if (auth.isAuthenticated) {
            getMyOrganizations().then((resp) => {
                if (resp) setMyOrganizations(resp);
            });
        }
    }, [auth.user]);

    useEffect(() => {
        if (auth.isAuthenticated) {
            const path = location.pathname.split("/");
            const organizationPathIndex = path.indexOf("organization");
            if (
                organizationPathIndex !== -1 &&
                path.length > organizationPathIndex + 1
            ) {
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
        if (isMobile) {
            setMobileNavbarOpen(false);
        }
    };

    const handleFpfSelect = (id: string) => {
        navigate(
            AppRoutes.displayFpf
                .replace(":organizationId", selectedOrganization.id)
                .replace(":fpfId", id)
        );
        if (isMobile) {
            setMobileNavbarOpen(false);
        }
    };

    return (
        <Container
            size="fluid"
            style={{ display: "flex", flexDirection: "column", width: "100%", padding: 0 }}
        >
            {/* FpF Modal */}
            <Modal
                opened={fpfModalOpen}
                onClose={() => setFpfModalOpen(false)}
                centered
                title={t("header.addFpf")}
            >
                <FpfForm organizationId={organizationId} close={setFpfModalOpen} />
            </Modal>

            {/* Header */}
            <Flex align="center" justify="space-between" style={{ padding: "1rem" }}>
                {/* Desktop: Always show the nav items */}
                {!isMobile && (
                    <Flex align="center" gap="md">
                        <IconSettings
                            size={24}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                navigate(
                                    AppRoutes.organization.replace(
                                        ":organizationId",
                                        selectedOrganization.id
                                    )
                                )
                            }
                        />
                        <Group gap="xs">
                            {organizations.map((org) => (
                                <Menu
                                    key={org.id}
                                    trigger="hover"
                                    openDelay={100}
                                    closeDelay={100}
                                    withinPortal
                                >
                                    <Menu.Target>
                                        <Text
                                            style={{
                                                cursor: "pointer",
                                                fontWeight: org.id === selectedOrganization.id ? 600 : 400,
                                            }}
                                        >
                                            {org.name}
                                        </Text>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={() => handleOrganizationSelect(org.name, org.id)}>
                                            {org.name}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            ))}
                        </Group>
                        <TextInput
                            variant="filled"
                            radius="md"
                            size="sm"
                            style={{ width: "150px", textOverflow: 'ellipsis' }}
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.currentTarget.value)}
                            placeholder={t("header.search")}
                            leftSection={<IconSearch size={16} />}
                        />
                    </Flex>
                )}

                {/* Mobile: Show a toggle button for the navbar */}
                {isMobile && (
                    <Button variant="outline" onClick={() => setMobileNavbarOpen(!mobileNavbarOpen)}>
                        {mobileNavbarOpen ? "Close Menu" : "Menu"}
                    </Button>
                )}
            </Flex>

            {/* Mobile Navbar Items */}
            {isMobile && mobileNavbarOpen && (
                <Flex direction="column" gap="md" style={{ padding: "0 1rem" }}>
                    <Flex align="center" gap="md">
                        <IconSettings
                            size={24}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                navigate(
                                    AppRoutes.organization.replace(
                                        ":organizationId",
                                        selectedOrganization.id
                                    )
                                );
                                setMobileNavbarOpen(false);
                            }}
                        />
                        <Group gap="xs">
                            {organizations.map((org) => (
                                <Menu
                                    key={org.id}
                                    trigger="hover"
                                    openDelay={100}
                                    closeDelay={100}
                                    withinPortal
                                >
                                    <Menu.Target>
                                        <Text
                                            style={{
                                                cursor: "pointer",
                                                fontWeight: org.id === selectedOrganization.id ? 600 : 400,
                                            }}
                                        >
                                            {org.name}
                                        </Text>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={() => handleOrganizationSelect(org.name, org.id)}>
                                            {org.name}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            ))}
                        </Group>
                    </Flex>
                    <TextInput
                        variant="filled"
                        radius="md"
                        size="sm"
                        style={{ width: "100px", textOverflow: 'ellipsis' }}
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.currentTarget.value)}
                        placeholder={t("header.search")}
                        leftSection={<IconSearch size={16} />}
                    />
                </Flex>
            )}

            {/* Divider for desktop view */}
            {!isMobile && <Divider my="sm" />}

            {/* FpF List */}
            <Container size="xl" style={{ width: "100%", padding: "0 1rem" }}>
                {fpfList
                    .filter((fpf) => fpf.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .map((fpf) => (
                        <Paper
                            key={fpf.id}
                            radius="md"
                            style={{
                                marginBottom: "1rem",
                                padding: "0.75rem 1rem",
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
