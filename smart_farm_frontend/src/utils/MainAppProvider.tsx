import React, {PropsWithChildren} from 'react';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { store } from './store';
import {WebStorageStateStore} from "oidc-client-ts";
import {AuthProvider} from "react-oidc-context";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';

export const oidcConfig = {
    authority: "https://farminsight-backend.etce.isse.tu-clausthal.de/o",
    client_id: "farminsight",
    client_secret: "NOlijQDCiurFkf1Ev27FD5USTw3sskpYoC4zvxvr91YgTwihoXBmIXm4P60BQ912PZLbHeZWniu0YSr4jxHFdh3063YEN4VRLO8qu200sN3SHofrzUpLO1dS5cQiqTJG",
    redirect_uri: window.location.origin + "/auth/callback",
    post_logout_redirect_uri: window.location.origin + "/auth/signout-callback",
    scopes: "profile openId offline_access",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true
};

const MainAppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        //Auth Provider goes here too
        //Redux Provider
        <AuthProvider {...oidcConfig}>
            <Provider store={store}>
                <MantineProvider defaultColorScheme="auto">
                    <Notifications position="bottom-right" zIndex={3000} limit={5}/>
                    {children}
                    </MantineProvider>
            </Provider>
        </AuthProvider>
    );
};

export default MainAppProvider;
