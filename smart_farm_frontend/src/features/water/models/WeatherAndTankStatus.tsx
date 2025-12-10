
export interface WeatherStatus {
    weatherCode: string;
    currentTemperature: number;
    rainProbabilityToday: number;
}

export interface WeatherAndTankStatus {
    tankWaterLevel: number;
    tankCapacity: number;
    pumpLastRun: Date;
    fpfStatus: string;
    weather: WeatherStatus
}
