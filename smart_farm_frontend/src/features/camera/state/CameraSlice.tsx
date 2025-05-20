import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../../utils/store";


interface CameraSlice {
    createdCameraEvent: number;
}

const initialState: CameraSlice = {
    createdCameraEvent: 0
}

const cameraSlice = createSlice({
    name: 'camera',
    initialState,

    reducers: {
        createdCamera(state){
            state.createdCameraEvent += 1
        }
    }
})

export const {createdCamera} = cameraSlice.actions
export const createdCameraEvent = (state:RootState) => state.camera.createdCameraEvent;
export default cameraSlice.reducer