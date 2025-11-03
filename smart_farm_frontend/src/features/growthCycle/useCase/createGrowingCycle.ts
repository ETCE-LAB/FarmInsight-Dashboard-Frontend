import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {GrowingCycle} from "../models/growingCycle";
import {BACKEND_URL} from "../../../env-config";


export const createGrowingCycle = (data:GrowingCycle) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/growing-cycles`;

    const result:  Promise<GrowingCycle> = apiClient.post(url, data, headers)
    return result
}