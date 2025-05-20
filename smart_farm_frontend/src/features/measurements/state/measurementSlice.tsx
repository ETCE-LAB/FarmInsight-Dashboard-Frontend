import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../../utils/store";


//Currently: 2 States, Logged in and not logged in
interface MeasurementSlice {
    receivedMeasurementEvent: number;
}

//At beginning, the suer is not logged in
const initialState: MeasurementSlice = {
    receivedMeasurementEvent: 0
}

//Über reducer Events verschicken
//reducer wäre der "Event-Bus"

const measurementSlice = createSlice({
    name: 'measurement',
    initialState,

    reducers: {
        receivedMeasurement(state){
            state.receivedMeasurementEvent += 1
        }
    }
})

export const {receivedMeasurement} = measurementSlice.actions
export const receivedMeasurementEvent = (state:RootState) => state.measurement.receivedMeasurementEvent;
export default measurementSlice.reducer




