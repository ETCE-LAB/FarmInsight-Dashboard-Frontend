import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {HardwareConfiguration} from "../models/HardwareConfiguration";
import {BACKEND_URL} from "../../../env-config";

export const getAvailableHardwareConfiguration = (fpfId: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}
    const url = `${BACKEND_URL}/api/sensors/types/available/${fpfId}`;
    const result:  Promise<HardwareConfiguration[]> = apiClient.get(url, headers)

    return result
}