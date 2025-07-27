import React from 'react';
import {Button} from "@mantine/core";
import {useAuth} from "react-oidc-context";
import { useTranslation } from 'react-i18next';
import {BACKEND_URL} from "../../../env-config";

export const LogoutButton = () => {
    const auth = useAuth();
    const { t, i18n } = useTranslation();

    return (
        <>
        {
            auth.isAuthenticated &&
            (<Button onClick={() => { void auth.removeUser(); window.location.href = `${BACKEND_URL}/api/logout?lc=${i18n.language}` }} variant="filled" color="red">{t('header.logout')}</Button>)
        }
        </>
    )
}
