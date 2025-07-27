import {useAuth} from "react-oidc-context";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "@mantine/core";

export const SignIn = () => {
    const auth = useAuth();
    const { t, i18n } = useTranslation();
    
    const login = () => {
        void auth.signinRedirect({
            extraQueryParams: {
                "lc": i18n.language,
            }
        })
    }
    
    useEffect(() => {
        login();
    }, [login]);
    
    return <Button onClick={ login } variant="filled" color= '#03A9F4' >{t("header.login")}</Button>
}