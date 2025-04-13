import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Threshold} from "../models/threshold";
import {BACKEND_URL} from "../../../env-config";

export const modifyThreshold = (HarvestEntityID:string, data:Threshold) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Ensure proper content type for JSON payload
    };

    const url = `${BACKEND_URL}/api/thresholds/${HarvestEntityID}`;
    const result:  Promise<Threshold> = apiClient.put(url, data, headers)

    return result
}