import {User} from "oidc-client-ts";
import {oidcConfig} from "./MainAppProvider";

export function getUser() {
    const oidcStorage = localStorage.getItem(`oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`)

    if (!oidcStorage) {
        return null;
    }

    return User.fromStorageString(oidcStorage);
}