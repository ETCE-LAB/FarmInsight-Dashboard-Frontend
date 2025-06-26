import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";

export const removeHardware = async (hardwareId:string) => {
    const apiClient = new APIClient()

    const headers = {
        'Authorization': `Bearer ${getUser()?.access_token}`,
    };

    const url = `${BACKEND_URL}/api/hardwares/${hardwareId}`;
    try {
        const response = await apiClient.delete(url, headers);
        if(response)
            return response.status >= 200 && response.status < 300;
        else
            return false
    } catch (error) {
        console.error('Error deleting growing cycle:', error);
        return false;
    }
}