import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {GrowingCycle} from "../models/growingCycle";
import {BACKEND_URL} from "../../../env-config";


export const modifyGrowingCycle = (growingCycleID:string, data:GrowingCycle) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const url = `${BACKEND_URL}/api/growing-cycles/${growingCycleID}`;

    const result:  Promise<GrowingCycle> = apiClient.put(url, data, headers)
    return result
}