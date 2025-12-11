
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

export interface WaterUsageData {
    date: string;
    usage: number;
}

export interface WaterStatus {
    waterLevel: number;
    capacity: number;
    dailyUsage: number;
    pumpStatus: 'active' | 'inactive' | 'error';
    pumpLastRun: Date;
    tankConnected: boolean;
    moistureMap: FieldMoistureData[];
    waterUsageChart: WaterUsageData[];
}

export interface WeatherAndWaterStatus {
    waterStatus: WaterStatus;
    weatherStatus: WeatherStatus;
    fieldMoisture: FieldMoistureData[];
    waterUsage: WaterUsageData[];
}
