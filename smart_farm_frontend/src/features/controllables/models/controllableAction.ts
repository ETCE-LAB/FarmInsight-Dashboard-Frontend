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



export const getActionChain = (action: ControllableAction, controllableActions: ControllableAction[]) => {
    let actions = [];
    for (let nextAction = controllableActions.find(x => x.id === action.nextAction);
         nextAction;
         nextAction = controllableActions.find(x => x.id === nextAction?.nextAction))
    {
        actions.push(nextAction.name);
    }

    return actions;
}