import {Sensor} from "../../sensor/models/Sensor";

interface BasicOrganization{
    id:string,
    name:string,
    isPublic:boolean
}

export interface BasicFPF {
    id:string,
    name:string
    organization:BasicOrganization,
    lastImageUrl:string,
    sensors: Sensor[],
    isActive: boolean
}