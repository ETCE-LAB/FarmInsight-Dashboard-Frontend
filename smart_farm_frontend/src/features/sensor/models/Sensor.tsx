

export interface Sensor {
    id:string,
    intervalSeconds:number,
    isActive:boolean,
    location:string,
    modelNr:string,
    name:string,
    unit:string,
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
    ]
}

export interface EditSensor {
    id: string,
    name:string,
    unit:string,
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