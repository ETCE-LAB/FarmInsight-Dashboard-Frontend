import APIClient from "../../../utils/APIClient";
import {BACKEND_URL} from "../../../env-config";
import {getUser} from "../../../utils/getUser";
import {Hardware} from "../models/hardware";


export const updateHardware = (data: Hardware) => {
    const apiClient = new APIClient()

    const headers = {'Authorization': `Bearer ${getUser()?.access_token}`}

    const url = `${BACKEND_URL}/api/hardwares/${data.id}`;

    return apiClient.put(url, data, headers);
}