import {createSlice } from "@reduxjs/toolkit";
import {RootState} from "../../../utils/store";


//Currently: 2 States, Logged in and not logged in
interface LocationSlice {
    receivedLocationEvent: number;
}

//At beginning, the suer is not logged in
const initialState: LocationSlice = {
    receivedLocationEvent: 0
}

//Über reducer Events verschicken
//reducer wäre der "Event-Bus"

const locationSlice = createSlice({
    name: 'location',
    initialState,

    reducers: {
        receivedLocation(state){
            state.receivedLocationEvent += 1
        }
    }
})

export const {receivedLocation} = locationSlice.actions
export const receivedLocationEvent = (state:RootState) => state.location.receivedLocationEvent;
export default locationSlice.reducer