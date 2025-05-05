import { AppShell, Burger, Flex } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { PropsWithChildren, useEffect, useState } from "react";
import { AppShellHeader } from "./components/appShellHeader"; // Import the header component
import { AppShellNavbar } from "./components/appShellNavbar";
import { AppRoutes } from "../../../utils/appRoutes"; // Import the navbar component
import { useMediaQuery } from "@mantine/hooks";
import { useAuth } from "react-oidc-context";

export const BasicAppShell: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    const noNavbarRoutes = [AppRoutes.base, AppRoutes.statusOverview, AppRoutes.legalNotice];
    const showNavbar = auth.isAuthenticated && !noNavbarRoutes.includes(location.pathname);
    const navigate = useNavigate();
    const [opened, setOpened] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (auth.isAuthenticated) {
            const lastVisitedOrganization = localStorage.getItem("lastVisitedOrganization");
            const redirectedFlag = sessionStorage.getItem("redirectedOnce");

            if (lastVisitedOrganization && !redirectedFlag) {
                navigate(AppRoutes.organization.replace(":organizationId", lastVisitedOrganization));
                sessionStorage.setItem("redirectedOnce", "true");
            }
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <AppShell
            header={{ height: 60 }}
            // Only provide the navbar prop if showNavbar is true
            navbar={showNavbar ? { width: "15vw", breakpoint: 'sm', collapsed: { mobile: !opened } } : undefined}
            padding="md"
        >
            <AppShell.Header>
                <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '60px' }}>
                    {isMobile && showNavbar && (
                        <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
                    )}
                    <AppShellHeader />
                </Flex>

            </AppShell.Header>

            {showNavbar && (
                <AppShell.Navbar>
                    <AppShellNavbar />
                </AppShell.Navbar>
            )}

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
};
