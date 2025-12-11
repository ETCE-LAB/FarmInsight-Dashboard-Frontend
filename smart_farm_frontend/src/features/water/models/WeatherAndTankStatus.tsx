
export interface WeatherStatus {
    weatherCode: string;
    currentTemperature: number;
    rainProbabilityToday: number;
}

export interface WaterStatus {
    waterLevel: number;
    capacity: number;
    pumpLastRun: Date;
}

export interface WeatherAndWaterStatus {
    waterStatus: WaterStatus;
    weatherStatus: WeatherStatus;
}
