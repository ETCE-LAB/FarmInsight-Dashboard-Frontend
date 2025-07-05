import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {Location} from "../models/location";


export const createLocation = (data: Location) => {
    const apiClient = new APIClient()
    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/locations`;

    return apiClient.post(url, data, headers);
}