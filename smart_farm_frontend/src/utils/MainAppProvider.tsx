import React, {PropsWithChildren} from 'react';
import { Provider } from 'react-redux';
import {createTheme, MantineProvider} from '@mantine/core';
import { store } from './store';
import {WebStorageStateStore} from "oidc-client-ts";
import {AuthProvider} from "react-oidc-context";
//import {SocketProvider} from "./SocketProvider";

export const oidcConfig = {
    authority: "https://development-isse-identityserver.azurewebsites.net",
    client_id: "interactive",
    redirect_uri: window.location.origin + "/auth/callback",
    post_logout_redirect_uri: window.location.origin + "/auth/signout-callback",
    scopes: "profile openId offline_access",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true
// ...
};

const theme = createTheme({
    autoContrast: true,
});


const MainAppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        //Auth Provider goes here too
        //Redux Provider
        <AuthProvider {...oidcConfig}>
            <Provider store={store}>
                {/* <SocketProvider> */}
                    <MantineProvider defaultColorScheme="auto" theme={theme}>
                        {children}
                    </MantineProvider>
               {/* </SocketProvider>*/}
            </Provider>
        </AuthProvider>
    );
};

export default MainAppProvider;
