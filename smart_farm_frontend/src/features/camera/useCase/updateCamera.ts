import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {EditCamera} from "../models/camera";
import {BACKEND_URL} from "../../../env-config";


export const updateCamera = (data: EditCamera) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/cameras/${data.id}`;
    return apiClient.put(url, data, headers);
}