import {createSlice, PayloadAction } from "@reduxjs/toolkit";
import {ControllableAction} from "../models/controllableAction";
import {ActionTrigger} from "../models/actionTrigger";


interface ControllableActionState{
    changeControllableActionEvent: number;
    controllableAction: ControllableAction[];
}

const initialState: ControllableActionState = {
    changeControllableActionEvent: 0,
    controllableAction: [],
}

const ControllableActionSlice = createSlice({
    name: 'ControllableAction',
    initialState,
    reducers: {
        changedControllableAction(state) {
            state.changeControllableActionEvent += 1
        },
        setControllableAction(state, action: PayloadAction<ControllableAction[]>) {
            state.controllableAction = action.payload;
        },
        addControllableAction(state, action: PayloadAction<ControllableAction>) {
            state.controllableAction.push(action.payload);
        },
        updateControllableAction(state, action: PayloadAction<ControllableAction>) {
            const index = state.controllableAction.findIndex(cycle => cycle.id === action.payload.id);
            if (index !== -1) {
                state.controllableAction[index] = action.payload;
            }
        },
        deleteControllableAction(state, action: PayloadAction<string>) {
            state.controllableAction = state.controllableAction.filter(cycle => cycle.id !== action.payload);
        },

        updateControllableActionStatus(state, action: PayloadAction<{ actionId: string; triggerId: string }>) {
            const { actionId, triggerId } = action.payload;
            const index = state.controllableAction.findIndex(ca => ca.id === actionId);
            if (index !== -1) {
                state.controllableAction[index].status = triggerId;
            }
        },

        updateIsAutomated(state, action: PayloadAction<{ actionId: string; isAutomated: boolean }>) {
            const { actionId, isAutomated } = action.payload;
            const index = state.controllableAction.findIndex(c => c.id === actionId);
            if (index !== -1) {
                state.controllableAction[index].isAutomated = isAutomated;
            if (isAutomated) {
                state.controllableAction[index].status = ""; // clear manual trigger
            }
            }
        },

        // Action Trigger logic

        addActionTrigger(state, action: PayloadAction<{ actionId: string; trigger: ActionTrigger }>) {
            const { actionId, trigger } = action.payload;
            const actionIndex = state.controllableAction.findIndex(ca => ca.id === actionId);
            if (actionIndex !== -1) {
                state.controllableAction[actionIndex].trigger.push(trigger);
            }
        }


        // modify

        // remove
    }
})

export const {
    changedControllableAction,
    setControllableAction,
    addControllableAction,
    updateControllableAction,
    deleteControllableAction,
    updateControllableActionStatus,
    updateIsAutomated,
    addActionTrigger
} = ControllableActionSlice.actions
export default ControllableActionSlice.reducer



