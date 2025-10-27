import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {EditCamera} from "../models/camera";
import {BACKEND_URL} from "../../../env-config";


export const createCamera= async (data: EditCamera) => {
        const apiClient = new APIClient()

        const user = getUser();
        const token = user?.access_token;

        const headers =
            {'Authorization': `Bearer ${token}`}

        const url = `${BACKEND_URL}/api/cameras`;

        return await apiClient.post(url, data, headers);
}