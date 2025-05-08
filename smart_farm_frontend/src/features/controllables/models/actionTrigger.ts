
export interface ActionTrigger{
    id:string;
    type: string;
    actionId: string,
    description: string;
    actionValueType: string;
    actionValue: string;
    triggerLogic: string;
    isActive: boolean;
}


export interface EditActionTrigger{
    fpfId: string;
    id: string;
    actionId: string,
    type: string;
    actionValueType: string;
    actionValue: string;
    triggerLogic: string;
    isActive: boolean;
    description:string;
}