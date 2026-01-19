import {Hardware} from "../../hardware/models/hardware";

export interface ActionQueue {
    id: string,
    createdAt: string,
    startedAt: string,
    endedAt?: string,
    value: string,
    controllableAction: {
        name: string,
        isActive: boolean,
        isAutomated: boolean,
        hardware: Hardware,
    },
    actionTrigger: {
        description: string,
        actionValueType: string,
        actionValue: string,
    },
    actionTriggerId: string,
    actionId: string,
    dependsOn?: string,
}
