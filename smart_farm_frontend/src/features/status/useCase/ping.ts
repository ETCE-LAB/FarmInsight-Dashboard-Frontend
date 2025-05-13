import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


const pingResource = (resourceType: string, resourceId: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/util/direct-ping/${resourceType}/${resourceId}`;
    return apiClient.get(url, headers);
}

export const pingSensor = (sensorId: string) => {
    return pingResource('sensor', sensorId);
}