import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {Hardware} from "../models/hardware";

export const getAllHardwares = () => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/hardwares/all`;
    const result:  Promise<Hardware[]> = apiClient.get(url, headers)

    return result
}