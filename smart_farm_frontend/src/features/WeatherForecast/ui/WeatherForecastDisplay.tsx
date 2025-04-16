import {WeatherForecast} from "../models/WeatherForecast";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Carousel} from "@mantine/carousel";
import {Badge, Box, Card, Group, Text} from "@mantine/core";
import {getWeatherForecast} from "../useCase/getWeatherForecast";
import {Location} from "../../location/models/location";
import {FaBolt, FaCloud, FaCloudRain, FaSmog, FaSnowflake, FaSun} from "react-icons/fa";
import {IconArrowsDiagonalMinimize2, IconSunFilled, IconWind} from "@tabler/icons-react";


export const WeatherForecastDisplay: React.FC<{ location: Location }> = ({ location }) => {
    const { t } = useTranslation();
    const [weatherForecasts, setWeatherForecasts] = useState<WeatherForecast[]>([]);
    const [isDetailedView, setIsDetailedView] = useState<number>(0);

    useEffect(() => {
        if(location) {
            getWeatherForecast(location.id)
                .then(resp => {
                    setWeatherForecasts(resp.reverse());
                })
        }
    }, [location]);

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}h ${mins}m ${secs.toFixed(0)}s`;
    };
    function formatTimeManually(dateString: string): string {
        // Validate format: the function expects "T" at position 10.
        if (dateString.length < 19 || dateString[10] !== 'T') {
            throw new Error("Invalid date string format: WeatherForecastDisplay. Expected 'YYYY-MM-DDTHH:MM:SS'");
        }

        // Extract the hour, minute, and second parts using substring indices.
        const hours = dateString.substring(11, 13);   // Characters from index 11 to 12.
        const minutes = dateString.substring(14, 16);   // Characters from index 14 to 15.
        const seconds = dateString.substring(17, 19);   // Characters from index 17 to 18.

        // Combine them into a formatted string.
        return `${hours}:${minutes}:${seconds}`;
    }

    const formatDate = (dateString: string): string => {
        /*
        * return: "YYYY-MM-DD HH:MM:SS" || "YYYY-MM-DD"
        * */

        return dateString.substring(0, 10) + " " +  (dateString.substring(11, 19) !== "00:00:00" ? dateString.substring(11, 19) : "");

    }

    const formatTimeText = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const returnString = `${hrs !== 0 ? hrs + "h " : ""}${mins !== 0 ? mins + "m " : "" } ${secs !== 0 ? secs.toFixed(0) + "s": ""}`

        return returnString.trim() === "" ? "0h" : returnString.trim();
    }

    function getWeatherDescription(code: string): string {
        switch (code) {
            case "0":
                return t('weatherForecast.weatherCode.clear');
            case "1":
                return t('weatherForecast.weatherCode.mainlyClear');
            case "2":
                return t('weatherForecast.weatherCode.partlyCloudy');
            case "3":
                return t('weatherForecast.weatherCode.overcast');
            case "45":
                return t('weatherForecast.weatherCode.fog');
            case "48":
                return t('weatherForecast.weatherCode.fogWithRime');
            case "51":
                return t('weatherForecast.weatherCode.drizzleLight');
            case "53":
                return t('weatherForecast.weatherCode.drizzleModerate');
            case "55":
                return t('weatherForecast.weatherCode.drizzleDense');
            case "56":
                return t('weatherForecast.weatherCode.freezingDrizzleLight');
            case "57":
                return t('weatherForecast.weatherCode.freezingDrizzleDense');
            case "61":
                return t('weatherForecast.weatherCode.rainLight');
            case "63":
                return t('weatherForecast.weatherCode.rainModerate');
            case "65":
                return t('weatherForecast.weatherCode.rainHeavy');
            case "66":
                return t('weatherForecast.weatherCode.freezingRainLight');
            case "67":
                return t('weatherForecast.weatherCode.freezingRainHeavy');
            case "71":
                return t('weatherForecast.weatherCode.snowFallSlight');
            case "73":
                return t('weatherForecast.weatherCode.snowFallModerate');
            case "75":
                return t('weatherForecast.weatherCode.snowFallHeavy');
            case "77":
                return t('weatherForecast.weatherCode.snowGrains');
            case "80":
                return t('weatherForecast.weatherCode.rainShowersLight');
            case "81":
                return t('weatherForecast.weatherCode.rainShowersModerate');
            case "82":
                return t('weatherForecast.weatherCode.rainShowersHeavy');
            case "85":
                return t('weatherForecast.weatherCode.snowShowersLight');
            case "86":
                return t('weatherForecast.weatherCode.snowShowersHeavy');
            case "95":
                return t('weatherForecast.weatherCode.thunderstormWithLightHail');
            case "96":
                return t('weatherForecast.weatherCode.thunderstormWithModerateHail');
            case "99":
                return t('weatherForecast.weatherCode.thunderstormWithHeavyHail');
            default:
                return t('weatherForecast.weatherCode.unknownWeatherCode');
        }
    }

    function getWeatherIcon(weatherCode: string): JSX.Element {
        switch (weatherCode) {
            case "0":
                return <FaSun size={24} />;
            case "1":
            case "2":
            case "3":
                return <FaCloud size={24} />;
            case "45":
            case "48":
                return <FaSmog size={24} />;
            case "51":
            case "53":
            case "55":
                return <FaCloudRain size={24} />;
            case "56":
            case "57":
                return <FaCloudRain size={24} />;
            case "63":
            case "65":
                return <FaCloudRain size={24} />;
            case "66":
            case "67":
                return <FaCloudRain size={24} />;
            case "71":
            case "73":
            case "75":
                return <FaSnowflake size={24} />;
            case "77":
                return <FaSnowflake size={24} />;
            case "80":
            case "81":
            case "82":
                return <FaCloudRain size={24} />;
            case "85":
            case "86":
                return <FaSnowflake size={24} />;
            case "95":
                return <FaBolt size={24} />;
            case "96":
            case "99":
                return <FaBolt size={24} />; // Or use a variant if available
            default:
                return <FaSun size={24} />;
        }
    }

    return (
        <Box>
            {(weatherForecasts && isDetailedView !== -1) ? (
                <Carousel   withIndicators loop initialSlide={isDetailedView} >
                    { weatherForecasts.map((forecast, index) => (
                        <Carousel.Slide key={index} >
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Box style={{marginLeft:"2vw", marginBottom:"0.5vh"} }>
                                        <Group mb="xs" >
                                            <Text  size={"xl"}>{index === 0 ? (t('weatherForecast.text.today')):(index === 1 ? (t("weatherForecast.text.tomorrow")):(t('weatherForecast.text.afterTomorrow')))}</Text>
                                            <Badge   color={forecast.weatherCode === "0" ? "yellow" : "blue"} variant="light">{getWeatherDescription(forecast.weatherCode)}</Badge>
                                            <IconArrowsDiagonalMinimize2 style={{marginLeft:"auto", cursor:"pointer"}} onClick={() => {setIsDetailedView(-1)}}/>
                                        </Group>
                                        <Text size="sm" color="dimmed"  >
                                            {t('weatherForecast.forecastDate')}: {formatDate(forecast.forecastDate.toString())}
                                        </Text>
                                        <Text size="xs" color="dimmed">
                                            {t('weatherForecast.fetchDate')}: {formatDate(forecast.fetchDate.toString())}
                                        </Text>
                                        <Text>
                                            {t('weatherForecast.text.temperature')}: {forecast.temperatureMinC}°C - {forecast.temperatureMaxC}°C
                                        </Text>
                                        <Text>
                                            {t('weatherForecast.rainMM')}: {forecast.rainMM} mm
                                        </Text>
                                        <Text>
                                            {t('weatherForecast.windSpeedMax')}: {forecast.windSpeedMax} km/h
                                        </Text>
                                        <Text>
                                            {t('weatherForecast.sunshineDurationSeconds')}: {formatDuration(forecast.sunshineDurationSeconds)}
                                        </Text>
                                        <Text >
                                            {t('weatherForecast.sunrise')}: {formatTimeManually(forecast.sunrise.toString())} | {t('weatherForecast.sunset')}: {formatTimeManually(forecast.sunset.toString())}
                                        </Text>
                                        <Text>
                                            {t('weatherForecast.text.precipitation')}: {forecast.precipitationMM} mm ({forecast.precipitationProbability}%)
                                        </Text>
                                    </Box>
                                </Card>
                        </Carousel.Slide>
                    ))
                    }
                </Carousel>

            ): (
                    <Group  mb="xs" justify="space-between">
                        { weatherForecasts.map((forecast, index) => (
                            <Card  padding="md" radius="lg" withBorder key={index} style={{ width: "200px", cursor: "pointer" } } onClick={() => setIsDetailedView(index)}>
                                <Box style={{display:"flex", justifyContent:"space-between"}} >
                                    <Text size={"xl"} style={{display:"flex", textAlign:"left", alignSelf:"flex-start"}}>{index === 0 ? (t('weatherForecast.text.today')):(index === 1 ? (t("weatherForecast.text.tomorrow")):(t('weatherForecast.text.afterTomorrow')))}</Text>
                                    {forecast.windSpeedMax > 20 && (<IconWind/>)}
                                </Box>
                                <Text size={"sm"}>{getWeatherDescription(forecast.weatherCode)}</Text>
                                <Box style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5vh", marginTop:"0.5vh"}}>
                                    {getWeatherIcon(forecast.weatherCode)}
                                    <Box style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                    <Text style={{textAlign:"right", marginRight:"0.1vw"}}>{formatTimeText(forecast.sunshineDurationSeconds)}</Text>
                                    <IconSunFilled ></IconSunFilled>
                                    </Box>
                                </Box>

                                <Text>{forecast.temperatureMinC}°C ~ {forecast.temperatureMaxC}°C</Text>
                            </Card>
                            )
                        )}
                    </Group>
            )}
        </Box>
    );
}