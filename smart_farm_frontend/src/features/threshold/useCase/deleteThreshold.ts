import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const deleteThreshold = (thresholdId:string) => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const url = `${BACKEND_URL}/api/thresholds/${thresholdId}`;

    const result: Promise<Response> = apiClient.delete(url, headers);
    return result;
}
