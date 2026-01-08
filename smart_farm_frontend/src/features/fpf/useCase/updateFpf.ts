import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { Fpf } from "../models/Fpf";
import { BACKEND_URL } from "../../../env-config";


export const updateFpf = async (fpfId: string, data: { name: string, isPublic: boolean, sensorServiceIp: string, locationId: string }) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        { 'Authorization': `Bearer ${token}` }

    const url = `${BACKEND_URL}/api/fpfs/${fpfId}`;

    const response: Fpf = await apiClient.put(url, data, headers);
    return response
};