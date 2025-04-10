import { WeatherForcast } from "../models/WeatherForcast";
import {BACKEND_URL} from "../../../env-config";

export const getWeatherForcast = async (locationId: string): Promise<WeatherForcast[]> => {

    const response = await fetch(`${BACKEND_URL}/weatherforecast/${locationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch weather forecast');
    }

    const data = await response.json();
    return data as WeatherForcast[];
}