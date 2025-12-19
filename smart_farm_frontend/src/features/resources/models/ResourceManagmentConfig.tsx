


export interface RMMSensorConfig {
    waterSensorId: string;
    soilSensorId: string;
}


export interface ResourceManagementConfig {
    rmmActive: boolean;
    rmmSensorConfig: RMMSensorConfig;
}
