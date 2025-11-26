import {createSlice } from "@reduxjs/toolkit";



//Currently: 2 States, Logged in and not logged in
interface ModelSlice {
    receivedModelEvent: number;
}

//At beginning, the suer is not logged in
const initialState: ModelSlice = {
    receivedModelEvent: 0
}

//Über reducer Events verschicken
//reducer wäre der "Event-Bus"

const modelSlice = createSlice({
    name: 'model',
    initialState,

    reducers: {
        receivedModel(state){
            state.receivedModelEvent += 1
        }
    }
})

export const {receivedModel} = modelSlice.actions
//export const receivedModelEvent = (state:RootState) => state.model.receivedModelEvent;
export default modelSlice.reducer




