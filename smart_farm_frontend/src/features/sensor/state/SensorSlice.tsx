import {createSlice } from "@reduxjs/toolkit";
import {RootState} from "../../../utils/store";


//Currently: 2 States, Logged in and not logged in
interface SensorSlice {
    receivedSensorEvent: number;
}

//At beginning, the suer is not logged in
const initialState: SensorSlice = {
    receivedSensorEvent: 0
}

//Über reducer Events verschicken
//reducer wäre der "Event-Bus"

const sensorSlice = createSlice({
    name: 'sensor',
    initialState,

    reducers: {
        receivedSensor(state){
            state.receivedSensorEvent += 1
        }
    }
})

export const {receivedSensor} = sensorSlice.actions
export const receivedSensorEvent = (state:RootState) => state.sensor.receivedSensorEvent;
export default sensorSlice.reducer




