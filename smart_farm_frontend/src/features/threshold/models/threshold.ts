export interface Threshold {
    id: string;
    sensorId: string | null;
    resourceManagementModelId: string | null;
    thresholdType: string;
    lowerBound: number;
    upperBound: number;
    color: string;
    description: string;
    rMMForecastName: string |  undefined
}