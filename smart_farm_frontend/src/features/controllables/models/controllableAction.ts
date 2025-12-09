import {Hardware} from "../../hardware/models/hardware";
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
    status: string,
    nextAction: string | null,
}

export interface EditControllableAction{
    fpfId: string,
    id:string;
    name: string,
    actionClassId: string,
    isActive: boolean,
    maximumDurationSeconds: number,
    additionalInformation: string,
    hardwareId: string | null,
    hardware: Hardware,
    trigger: ActionTrigger[],
    nextAction: string | null,
}