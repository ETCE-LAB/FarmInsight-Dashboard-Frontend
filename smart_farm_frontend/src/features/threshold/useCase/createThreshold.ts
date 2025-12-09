import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Threshold} from "../models/threshold";
import {BACKEND_URL} from "../../../env-config";


export const createThreshold = (data:Threshold) => {
    const apiClient = new APIClient()
    console.log(data)
    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/thresholds`;

    const result:  Promise<Threshold> = apiClient.post(url, data, headers)
    return result
}