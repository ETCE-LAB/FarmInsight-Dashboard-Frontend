import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {EditSensor} from "../models/Sensor";
import {BACKEND_URL} from "../../../env-config";


export const getSensor = (sensorId: string): Promise<EditSensor> => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/sensors/${sensorId}`;

    return apiClient.get(url, headers);
}