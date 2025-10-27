import { WeatherForecast } from "../models/WeatherForecast";
import {BACKEND_URL} from "../../../env-config";
import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";


export const getWeatherForecast = (locationId: string): Promise<WeatherForecast[]> => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/weather-forecasts/${locationId}`;

    const result:  Promise<WeatherForecast[]> = apiClient.get(url, headers)
    return result
}