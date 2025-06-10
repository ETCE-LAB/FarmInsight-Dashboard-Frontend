import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Card, Flex, Group, Text, Menu, Button, Image, Drawer, Center, Box} from '@mantine/core';
import { IconDotsVertical } from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '../../../../utils/appRoutes';
import { UserProfileComponent } from '../../../../features/userProfile/ui/UserProfileComponent';
import { LoginButton } from '../../../../features/auth/ui/loginButton';
import { LogoutButton } from '../../../../features/auth/ui/logoutButton';
import { useMediaQuery } from '@mantine/hooks';
import {useAuth} from "react-oidc-context";
import {receiveUserProfile} from "../../../../features/userProfile/useCase/receiveUserProfile";
import {SystemRole} from "../../../../features/userProfile/models/UserProfile";

const languageOptions = [
    { code: 'en', label: 'English', flag: 'us' },
    { code: 'de', label: 'German', flag: 'de' },
];

export const AppShellHeader: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [currentFlag, setCurrentFlag] = useState('us');
    const [drawerOpened, setDrawerOpened] = useState(false); // State to manage Drawer visibility
    const auth = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    // Detect mobile devices (viewport widths 768px or less)
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Set default language based on the browser's language
    useEffect(() => {
        const browserLanguage = navigator.language.split('-')[0];
        const matchedLanguage =
            languageOptions.find((lang) => lang.code === browserLanguage) || languageOptions[0];

        setSelectedLanguage(matchedLanguage.label);
        setCurrentFlag(matchedLanguage.flag);
        i18n.changeLanguage(matchedLanguage.code);
    }, [i18n, languageOptions]);

    const handleLanguageChange = (lang: { code: string; label: string; flag: string }) => {
        setSelectedLanguage(lang.label);
        setCurrentFlag(lang.flag);
        i18n.changeLanguage(lang.code);
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            receiveUserProfile().then((user) => {
                setIsAdmin(user.systemRole === SystemRole.ADMIN);
            });
        }
    }, [auth.isAuthenticated]);

    const renderFlagImage = (flag: string, alt: string) => (
        <Image
            src={`/assets/flags/${flag}.png`}
            alt={alt}
            width={24}
            height={16}
            onError={(e) => (e.currentTarget.src = '/assets/flags/us.png')} // Fallback if image fails to load
        />
    );

    const LanguageSelector = () => (
        <Menu width={isMobile ? 150 : 200}>
            <Menu.Target>
                <Button variant="subtle" size={isMobile ? 'xs' : 'sm'} style={{ padding: isMobile ? '4px 8px' : '8px 12px' }}>
                    <Flex align="center" gap={isMobile ? 'xs' : 'sm'}>
                        {renderFlagImage(currentFlag, selectedLanguage)}
                        <span style={{ fontSize: isMobile ? '14px' : 'inherit' }}>
                                        {selectedLanguage}
                                    </span>
                    </Flex>
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                {languageOptions.map((lang) => (
                    <Menu.Item key={lang.code} onClick={() => handleLanguageChange(lang)}>
                        <Flex align="center" gap={isMobile ? 'xs' : 'sm'}>
                            {renderFlagImage(lang.flag, lang.label)}
                            <span style={{ fontSize: isMobile ? '14px' : 'inherit' }}>
                                            {lang.label}
                                        </span>
                        </Flex>
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );

    const TitleCard = () => (
        <Card
            shadow="sm"
            padding={isMobile ? 'sm' : 'lg'}
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(AppRoutes.base)}
        >
            <Card.Section>
                <Text
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: isMobile ? '4px 8px' : '8px 16px',
                        fontSize: isMobile ? '16px' : '20px',
                        fontFamily: 'Open Sans, sans-serif',
                        fontWeight: 'bold',
                    }}
                >
                    {t('header.title')}
                </Text>
            </Card.Section>
        </Card>
    );

    const navigateAndCloseDrawer = (route: string) => {
        navigate(route);
        setDrawerOpened(false);
    }

    return (
        <>
            {isMobile ? (
                <Flex justify="space-between" w="100%" align="center">
                    <TitleCard />
                    <IconDotsVertical
                        onClick={() => setDrawerOpened((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                        aria-label="Toggle user menu"
                    />
                    <Drawer
                        opened={drawerOpened}
                        onClose={() => setDrawerOpened(false)}
                        padding="md"
                    >
                        <Flex direction="column" gap="md">
                            <LanguageSelector />
                            {auth.isAuthenticated && <Button onClick={() => navigateAndCloseDrawer(AppRoutes.statusOverview)}>{t('header.statusOverview')}</Button>}
                            {isAdmin && <Button onClick={() => navigateAndCloseDrawer(AppRoutes.adminPage)}>{t('header.adminPage')}</Button>}
                            <UserProfileComponent onNavigate={() => setDrawerOpened(false)} />
                            <LoginButton />
                            <LogoutButton />
                        </Flex>
                    </Drawer>
                </Flex>
            ) : (
                <Flex justify="space-between" w="100%">
                    <Group gap='md'>
                        <TitleCard />
                        <LanguageSelector />
                    </Group>
                    <Group gap='md'>
                        {auth.isAuthenticated && <Button onClick={() => navigate(AppRoutes.statusOverview)}>{t('header.statusOverview')}</Button>}
                        {isAdmin && <Button onClick={() => navigate(AppRoutes.adminPage)}>{t('header.adminPage')}</Button>}
                        <UserProfileComponent />
                        <LoginButton />
                        <LogoutButton />
                    </Group>
                </Flex>
            )}
        </>
    );
};
