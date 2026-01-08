


export interface RMMSensorConfig {
    waterSensorId: string;
    soilSensorId: string;
    tankCapacity: number;
}


export interface ResourceManagementConfig {
    rmmActive: boolean;
    rmmSensorConfig: RMMSensorConfig;
}
