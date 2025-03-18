import React from 'react';
import {Button} from "@mantine/core";
import {useAuth} from "react-oidc-context";
import { useTranslation } from 'react-i18next';

export const LoginButton = () => {
    const auth = useAuth();
    const { t } = useTranslation();

    const onClick = () => {
        void auth.signinRedirect()
    }

    return (
        <>
        {
            !auth.isAuthenticated &&
            (<Button onClick={() => onClick() } variant="filled" color= '#03A9F4' >{t("header.login")}</Button>)
        }
        </>
    )
}
