import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../utils/store";
import { Fpf } from "../models/Fpf";


//Currently: 2 States, Logged in and not logged in
interface FpfSlice {
    createdFpfEvent: number;
    fpf: Fpf;
}

//At beginning, the user is not logged in
const initialState: FpfSlice = {
    createdFpfEvent: 0,
    fpf: {
        id: "",
        name: "",
        isPublic: true,
        Sensors: [],
        Models: [],
        Cameras: [],
        sensorServiceIp: "",
        Location: { id: "", name: "", latitude: 0, longitude: 0, city: "", street: "", houseNumber: "", organizationId: "", gatherForecasts: false },
        GrowingCycles: [],
        ControllableAction: [],
        Hardware: [],
        isActive: true,
        resourceManagementConfig: {
            rmmActive: false,
            rmmSensorConfig: {
                waterSensorId: "",
                soilSensorId: ""
            }
        }
    }
}


const fpfSlice = createSlice({
    name: 'fpf',
    initialState,

    reducers: {
        createdFpf(state) {
            state.createdFpfEvent += 1
        },
        updatedFpf(state, action: PayloadAction<Fpf>) {
            state.fpf = action.payload;
        }
    }
})

export const { createdFpf, updatedFpf } = fpfSlice.actions
export const receivedUserProfileEvent = (state: RootState) => state.fpf.createdFpfEvent;
export default fpfSlice.reducer