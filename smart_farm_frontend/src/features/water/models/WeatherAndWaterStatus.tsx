
export interface WeatherStatus {
    weatherCode: string;
    currentTemperature: number;
    rainProbabilityToday: number;
}

export interface FieldMoistureData {
    fieldId: number;
    moisture: number;
    crop: string;
}

export interface WaterLevels {
    date: string;
    waterLevel: number;
}

export interface WaterStatus {
    waterLevel: number;
    capacity: number;
    avgUsage: number;
    pumpStatus: 'thisWeekActive' | 'thisWeekInactive';
    pumpLastRun: Date;
}

export interface WeatherAndWaterStatus {
    waterStatus: WaterStatus;
    weatherStatus: WeatherStatus;
    fieldMoisture: FieldMoistureData[];
    waterLevels: WaterLevels[];
}
