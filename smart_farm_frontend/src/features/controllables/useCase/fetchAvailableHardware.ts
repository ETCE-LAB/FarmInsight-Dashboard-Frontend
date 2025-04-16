import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {Hardware} from "../models/hardware";


export const fetchAvailableHardware = (fpfId:string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/fpfs/${fpfId}/hardware`;
    const result:  Promise<Hardware[]> = apiClient.get(url, headers)

    return result
}