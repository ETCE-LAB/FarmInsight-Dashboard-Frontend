import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ActionTrigger} from "../models/actionTrigger";

export const executeTrigger = (controllableActionId: string, actionTriggerId: string, actionValue: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/execute-actions/${controllableActionId}/${actionTriggerId}`;
    const result: Promise<ActionTrigger> = apiClient.post(url, {actionValue:actionValue}, headers)

    return result
}