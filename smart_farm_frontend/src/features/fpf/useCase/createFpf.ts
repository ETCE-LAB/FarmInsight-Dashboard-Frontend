import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";

import {Fpf} from "../models/Fpf";
import {BACKEND_URL} from "../../../env-config";

export const createFpf = async (data: { name:string, isPublic:boolean, sensorServiceIp:string, address:string, organizationId:string }) => {
    try {
        //const response = await fetch(`${BACKEND_URL}/api/organizations`, {
        const apiClient = new APIClient()

        const user = getUser();
        const token = user?.access_token;

        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${BACKEND_URL}/api/fpfs`;
        const response:Fpf = await apiClient.post(url, data, headers);

        return response
    }
    catch (error) {
        console.error("Error: " + error);
    }
};