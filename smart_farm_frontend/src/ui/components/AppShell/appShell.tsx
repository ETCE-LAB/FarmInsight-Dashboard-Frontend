import { AppShell } from '@mantine/core';
import React, { PropsWithChildren } from "react";
import { AppShell_Header } from "./components/appShell_Header"; // Import the header component
import { AppShell_Navbar } from "./components/appShell_Navbar"; // Import the navbar component

export const BasicAppShell: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: "15vw", breakpoint: 'sm' }}
            padding="md"
        >
            <AppShell.Header>
                <AppShell_Header />
            </AppShell.Header>
            <AppShell.Navbar>
                <AppShell_Navbar />
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
};
