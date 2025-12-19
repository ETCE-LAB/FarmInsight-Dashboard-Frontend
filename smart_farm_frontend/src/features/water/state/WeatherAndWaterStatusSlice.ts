import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeatherAndWaterStatus } from "../models/WeatherAndWaterStatus";


interface WeatherAndWaterStatusSlice {
    WeatherAndWaterStatus: [{ [fpfId: string]: WeatherAndWaterStatus }];
}

const initialState: WeatherAndWaterStatusSlice = {
    WeatherAndWaterStatus: [{}]
}


const weatherAndWaterStatusSlice = createSlice({
    name: 'weatherAndWaterStatus',
    initialState,

    reducers: {
        registerWeatherAndWaterStatus(state, action: PayloadAction<{ [fpfId: string]: WeatherAndWaterStatus }>) {
            state.WeatherAndWaterStatus.push(action.payload);
        }
    }
})

export const { registerWeatherAndWaterStatus } = weatherAndWaterStatusSlice.actions
export default weatherAndWaterStatusSlice.reducer
