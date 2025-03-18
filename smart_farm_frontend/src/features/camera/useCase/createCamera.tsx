import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {EditCamera} from "../models/camera";
import {BACKEND_URL} from "../../../env-config";

export const createCamera= async (data: EditCamera) => {
        try {
            const apiClient = new APIClient()
            const user = getUser();
            const token = user?.access_token;
            const headers =
                {'Authorization': `Bearer ${token}`}
            const url = `${BACKEND_URL}/api/cameras`;
            const response = await apiClient.post(url, data, headers);

            return response;
        }
        catch (error) {
            console.error("Error: " + error);
            return error
        }
    };