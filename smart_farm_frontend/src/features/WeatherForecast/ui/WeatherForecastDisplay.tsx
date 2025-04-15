import {WeatherForecast} from "../models/WeatherForecast";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Carousel} from "@mantine/carousel";
import {Badge, Box, Card, Group, Text} from "@mantine/core";
import {getWeatherForecast} from "../useCase/getWeatherForecast";
import {Location} from "../../location/models/location";

//Design Idea:
// Display the weather forecast in a Carousel Format
// Reload Function? (Get newest Forcast from backend?) -> Niche use case



export const WeatherForecastDisplay: React.FC<{ location: Location }> = ({ location }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weatherForecasts, setWeatherForecasts] = useState<WeatherForecast[]>([]);

    useEffect(() => {
        if(location) {
            setIsLoading(true);
            getWeatherForecast(location.id)
                .then(resp => {
                    setWeatherForecasts(resp.reverse());
                    setIsLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setIsLoading(false);
                });
        }
    }, [location]);

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}h ${mins}m ${secs}s`;
    };
    const formatDate = (date: Date) => {
        return date.toString();
    };

    return (
        <>
        {weatherForecasts && weatherForecasts.length > 0 && (
        <Box>
            <Carousel>
                { weatherForecasts.map((forecast, index) => (
                    <Carousel.Slide key={index}>

                            <Card shadow="sm" padding="lg" radius="md" withBorder >
                                <Group mb="xs">
                                    <Text >Weather Forecast</Text>
                                    <Badge color="blue" variant="light">{forecast.weatherCode}</Badge>
                                </Group>

                                <Text size="sm" color="dimmed">
                                    Forecast Date: {formatDate(forecast.forecastDate)}
                                </Text>
                                <Text size="sm" color="dimmed">
                                    Fetch Date: {formatDate(forecast.fetchDate)}
                                </Text>

                                <Text mt="md">
                                    Temperature: {forecast.temperatureMinC}°C - {forecast.temperatureMaxC}°C
                                </Text>
                                <Text mt="md">
                                    Rain: {forecast.rainMM} mm
                                </Text>
                                <Text mt="md">
                                    Sunshine Duration: {formatDuration(forecast.sunshineDurationSeconds)}
                                </Text>
                                <Text mt="md">
                                    Wind Speed Max: {forecast.windSpeedMax} km/h
                                </Text>
                                <Text mt="md">
                                    Sunrise: {formatDate(forecast.sunrise)} | Sunset: {formatDate(forecast.sunset)}
                                </Text>
                                <Text mt="md">
                                    Precipitation: {forecast.precipitationMM} mm ({forecast.precipitationProbability}%)
                                </Text>
                            </Card>
                    </Carousel.Slide>
                ))
                }
            </Carousel>
        </Box>
        )}
        </>
    );
}