import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {Hardware} from "../models/hardware";


export const createHardware = async (data: Hardware) => {
    const apiClient = new APIClient()
    const headers = {'Authorization': `Bearer ${getUser()?.access_token}`}
    const url = `${BACKEND_URL}/api/hardwares`;
    return await apiClient.post(url, data, headers);
}