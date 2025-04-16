import {Hardware} from "./hardware";
import {ActionTrigger} from "./actionTrigger";


export interface ControllableAction{
    id:string;
    name: string,
    actionClassId: string,
    actionScriptName: string,
    isActive: boolean,
    isAutomated: boolean,
    maximumDurationSeconds: number,
    additionalInformation: string,
    hardware: Hardware,
    trigger: ActionTrigger[],
    status: string
}

export interface EditControllableAction{
    fpfId: string,
    id:string;
    name: string,
    actionClassId: string,
    isActive: boolean,
    maximumDurationSeconds: number,
    additionalInformation: string,
    hardwareId: string,
    trigger: ActionTrigger[],
}