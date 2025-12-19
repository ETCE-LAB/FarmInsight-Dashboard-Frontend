
import { WeatherAndWaterStatus } from "../models/WeatherAndWaterStatus";
import { BACKEND_URL } from "../../../env-config";
import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { Fpf } from "../../fpf/models/Fpf";
import { ResourceManagementConfig } from "../../resources/models/ResourceManagmentConfig";

export interface UpdateRmm {
    resourceManagementConfig: {
        rmmActive: boolean;
        rmmSensorConfig: {
            waterSensorId: string;
            soilSensorId: string;
        };
    };
}

export const updateRmm = (fpfId: string, updateRmm: UpdateRmm): Promise<ResourceManagementConfig> => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;
    const headers =
        { 'Authorization': `Bearer ${token}` }

    const url = `${BACKEND_URL}/api/sensors/${fpfId}/resource-management/rmm-sensor-config`;

    const result: Promise<ResourceManagementConfig> = apiClient.put(url, updateRmm, headers)
    console.log("result:", result)
    return result
}
