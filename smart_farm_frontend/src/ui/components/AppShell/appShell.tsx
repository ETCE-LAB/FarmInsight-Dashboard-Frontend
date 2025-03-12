import {AppShell, Burger, Flex} from '@mantine/core';
import { useLocation } from 'react-router-dom';
import React, {PropsWithChildren, useState} from "react";
import { AppShellHeader } from "./components/appShellHeader"; // Import the header component
import { AppShellNavbar } from "./components/appShellNavbar";
import {useAuth} from "react-oidc-context";
import {AppRoutes} from "../../../utils/appRoutes"; // Import the navbar component
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {useMediaQuery} from "@mantine/hooks";

export const BasicAppShell: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    const noNavbarRoutes = [AppRoutes.base];
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
            navbar={{ width: "15vw", breakpoint: 'sm', collapsed: { mobile: !opened }, }}
            padding="md"
        >
            <AppShell.Header>
                <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',  height: '60px' }}>
                    {/* Burger Menu auf mobilen Geräten */}
                    {isMobile && showNavbar &&  (
                        <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
                    )}
                    {/* Der Header bleibt an Ort und Stelle */}
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