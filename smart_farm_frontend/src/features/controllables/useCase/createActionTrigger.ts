import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ActionTrigger, EditActionTrigger} from "../models/actionTrigger";


export const createActionTrigger = (actionTrigger:EditActionTrigger) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/action-trigger`;
    const result:  Promise<ActionTrigger> = apiClient.post(url, actionTrigger, headers)

    return result
}