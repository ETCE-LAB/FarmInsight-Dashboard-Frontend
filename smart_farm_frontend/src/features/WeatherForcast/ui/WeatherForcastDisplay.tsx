import {WeatherForcast} from "../models/WeatherForcast";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Carousel} from "@mantine/carousel";
import {Box} from "@mantine/core";

//Design Idea:
// Display the weather forecast in a Carousel Format
// Reload Function? (Get newest Forcast from backend?) -> Niche use case



export const WeatherForcastDisplay: React.FC<{ weatherForcasts: WeatherForcast[] }> = ({ weatherForcasts }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    return (
        <Box>
            <Carousel>
                { weatherForcasts.map((forecast, index) => (
                    <Carousel.Slide key={index}>
                        <Box>
                            <h2>{t('weatherForecast.date', { date: forecast.forecastDate })}</h2>
                            <p>{t('weatherForecast.rainMM', { rainMM: forecast.rainMM })}</p>
                            <p>{t('weatherForecast.sunshineDuration', { sunshineDuration: forecast.sunshineDurationSeconds })}</p>
                            <p>{t('weatherForecast.weatherCode', { weatherCode: forecast.weatherCode })}</p>
                            <p>{t('weatherForecast.windSpeedMax', { windSpeedMax: forecast.windSpeedMax })}</p>
                            <p>{t('weatherForecast.temperatureMin', { temperatureMin: forecast.temperatureMinC })}</p>
                            <p>{t('weatherForecast.temperatureMax', { temperatureMax: forecast.temperatureMaxC })}</p>
                            <p>{t('weatherForecast.sunrise', { sunrise: forecast.sunrise })}</p>
                            <p>{t('weatherForecast.sunset', { sunset: forecast.sunset })}</p>
                            <p>{t('weatherForecast.precipitationMM', { precipitationMM: forecast.precipitationMM })}</p>
                            <p>{t('weatherForecast.precipitationProbability', { precipitationProbability: forecast.precipitationProbability })}</p>
                        </Box>
                    </Carousel.Slide>
                ))

                }
            </Carousel>
        </Box>
    );
}