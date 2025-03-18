import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {GrowingCycle} from "../models/growingCycle";
import {BACKEND_URL} from "../../../env-config";

//8250f7569a3047ea8decf4cc101003da
//"2017-07-21T17:32:28Z
////"2017-07-21
export const modifyGrowingCycle = (growingCycleID:string, data:GrowingCycle) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Ensure proper content type for JSON payload
    };

    const url = `${BACKEND_URL}/api/growing-cycles/${growingCycleID}`;
    const result:  Promise<GrowingCycle> = apiClient.put(url, data, headers)

    return result
}