import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";


export const deleteThreshold = async (thresholdId:string) => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Ensure proper content type for JSON payload
    };

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/thresholds/${thresholdId}`;

    const result: Promise<Response | undefined> = apiClient.delete(url, headers);
    return result;
}