import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ActionScript} from "../models/actionScript";

export const fetchAvailableActionScripts = (fpfId: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/action-scripts/types/${fpfId}`;
    const result:  Promise<ActionScript[]> = apiClient.get(url, headers)

    return result
}