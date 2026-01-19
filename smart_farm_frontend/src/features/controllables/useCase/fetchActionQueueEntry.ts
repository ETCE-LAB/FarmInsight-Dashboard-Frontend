import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ActionQueue} from "../models/actionQueue";


export const fetchActionQueueEntry = (fpfId: string, entryId: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/action-queue/${fpfId}/${entryId}`;
    const result:  Promise<ActionQueue> = apiClient.get(url, headers)

    return result
}