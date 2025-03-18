import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {EditSensor} from "../models/Sensor";
import {BACKEND_URL} from "../../../env-config";

export const updateSensor = async (data: EditSensor) => {
    try {
        const apiClient = new APIClient()
        const user = getUser();
        const token = user?.access_token;
        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${BACKEND_URL}/api/sensors/${data.id}`;
        return await apiClient.put(url, data, headers);
    }
    catch (error) {
        console.error("Error: " + error);
        return error
    }
};