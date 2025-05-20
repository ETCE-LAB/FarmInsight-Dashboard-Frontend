import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ActionTrigger, EditActionTrigger} from "../models/actionTrigger";

export const updateActionTrigger = async (actionTrigger:EditActionTrigger) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;
    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/action-trigger/${actionTrigger.id}`;
    const result: ActionTrigger = await apiClient.put(url, actionTrigger, headers)

    return result
}