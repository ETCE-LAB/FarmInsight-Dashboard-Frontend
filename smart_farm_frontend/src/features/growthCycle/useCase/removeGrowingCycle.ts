import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const removeGrowingCycle = (growingCycleID:string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Ensure proper content type for JSON payload
    };

    const url = `${BACKEND_URL}/api/growing-cycles/${growingCycleID}`;

    return apiClient.delete(url, headers);
}