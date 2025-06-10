import { AppShell, Burger, Flex } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { PropsWithChildren, useEffect, useState } from "react";
import { AppShellHeader } from "./components/appShellHeader";
import { AppShellNavbar } from "./components/appShellNavbar";
import { AppRoutes } from "../../../utils/appRoutes";
import { useMediaQuery } from "@mantine/hooks";
import { useAuth } from "react-oidc-context";

export const BasicAppShell: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    const noNavbarRoutes = [AppRoutes.base, AppRoutes.statusOverview, AppRoutes.legalNotice, AppRoutes.adminPage];
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
                <Flex align="center" h="60px" p="0 1em" gap="1em">
                    {isMobile && showNavbar && (
                        <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
                    )}
                    <AppShellHeader />
                </Flex>
            </AppShell.Header>

            {showNavbar && (
                <AppShell.Navbar>
                    <AppShellNavbar onNavbarShouldClose={() => setOpened(false)} />
                </AppShell.Navbar>
            )}

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
};
