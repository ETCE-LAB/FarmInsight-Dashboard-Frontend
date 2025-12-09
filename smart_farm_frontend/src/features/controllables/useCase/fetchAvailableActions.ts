import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ControllableAction} from "../models/controllableAction";

export const fetchAvailableActions = (fpfId: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/controllable-actions/all/${fpfId}`;
    const result:  Promise<ControllableAction[]> = apiClient.get(url, headers)

    return result
}