import {Threshold} from "../../threshold/models/threshold";


export interface Sensor {
    id:string,
    intervalSeconds:number,
    isActive:boolean,
    location:string,
    modelNr:string,
    name:string,
    unit:string,
    parameter:string;
    fpfId:string,

    lastMeasurement: {
        measuredAt: Date,
        value: number,
    },

    measurements: [
        {
            measuredAt: Date
            value:number
        }
    ],

    thresholds: Threshold[],
}

export interface EditSensor {
    id: string,
    name:string,
    unit:string,
    parameter: string;
    location:string,
    modelNr:string,
    intervalSeconds:number,
    isActive:boolean,
    fpfId:string,

    hardwareConfiguration: {
        sensorClassId:string,
        additionalInformation: Record<string, any>
    }
}