import { WeatherForecast } from "../models/WeatherForecast";
import {BACKEND_URL} from "../../../env-config";

export const getWeatherForecast = async (locationId: string): Promise<WeatherForecast[]> => {

    const response = await fetch(`${BACKEND_URL}/api/weather-forecasts/${locationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch weather forecast');
    }

    const data = await response.json();

    return data as WeatherForecast[];
}