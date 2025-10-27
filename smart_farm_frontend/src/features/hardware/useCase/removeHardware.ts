import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const removeHardware = async (hardwareId:string) => {
    const apiClient = new APIClient()

    const headers = {
        'Authorization': `Bearer ${getUser()?.access_token}`,
    };

    const url = `${BACKEND_URL}/api/hardwares/${hardwareId}`;

    return await apiClient.delete(url, headers);
}