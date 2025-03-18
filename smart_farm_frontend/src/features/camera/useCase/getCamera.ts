import {EditSensor} from "../../sensor/models/Sensor";
import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {EditCamera} from "../models/camera";
import {BACKEND_URL} from "../../../env-config";


export const getCamera = async (cameraId: string): Promise<EditCamera|undefined> => {
    try {
        const apiClient = new APIClient()
        const user = getUser();
        const token = user?.access_token;
        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${BACKEND_URL}/api/cameras/${cameraId}`;
        return await apiClient.get(url, headers);
    }
    catch (error) {
        console.error("Error: " + error);
        return undefined
    }
};