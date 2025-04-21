import APIClient from "../../../utils/APIClient";
import {BACKEND_URL} from "../../../env-config";
import {getUser} from "../../../utils/getUser";
import {Location} from "../models/location";

export const updateLocation = async (data: Location) => {
    try {
        const apiClient = new APIClient()
        const user = getUser();
        const token = user?.access_token;
        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${BACKEND_URL}/api/locations/${data.id}`;

        return await apiClient.put(url, data, headers);
    }
    catch (error) {
        console.error("Error: " + error);
        return error
    }
}