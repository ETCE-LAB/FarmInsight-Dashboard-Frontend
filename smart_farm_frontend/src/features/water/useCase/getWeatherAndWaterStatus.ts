
import { WeatherAndWaterStatus } from "../models/WeatherAndWaterStatus";
import { BACKEND_URL } from "../../../env-config";
import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";

export const getWeatherAndWaterStatus = (locationId: string, fpfId: string): Promise<WeatherAndWaterStatus> => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        { 'Authorization': `Bearer ${token}` }

    const url = `${BACKEND_URL}/api/sensors/${locationId}/weather-and-tank-status/${fpfId}`;

    const result: Promise<WeatherAndWaterStatus> = apiClient.get(url, headers)

    return result
}
