import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {GrowingCycle} from "../models/growingCycle";
import {BACKEND_URL} from "../../../env-config";


export const createGrowingCycle = async (data:GrowingCycle) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/growing-cycles`;

    try {
        const result: GrowingCycle = await apiClient.post(url, data, headers)
        return result;
    } catch (error){
        console.error("Error while creating cycle:", error);
        throw error;
    }
}