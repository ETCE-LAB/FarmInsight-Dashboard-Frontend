
export interface LogMessage {
    id:string,
    createdAt:string
    relatedResourceId:string,
    logLevel:string,
    message:string,
}


export enum ResourceType {
    FPF = 'fpf',
    SENSOR = 'sensor',
    CAMERA = 'camera',
    ORGANIZATION = 'org',
    ADMIN = 'admin',
}