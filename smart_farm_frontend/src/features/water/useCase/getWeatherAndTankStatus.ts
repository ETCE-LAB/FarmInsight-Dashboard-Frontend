
import { WeatherAndTankStatus } from "../models/WeatherAndTankStatus";
import { BACKEND_URL } from "../../../env-config";
import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";

export const getWeatherAndTankStatus = (locationId: string, sensorId: string): Promise<WeatherAndTankStatus> => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        { 'Authorization': `Bearer ${token}` }

    const url = `${BACKEND_URL}/api/sensors/${locationId}/weather-and-tank-status/${sensorId}`;

    const result: Promise<WeatherAndTankStatus> = apiClient.get(url, headers)
    console.log("result:", result)
    return result
}
