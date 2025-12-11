import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeatherAndWaterStatus } from "../models/WeatherAndWaterStatus";


interface WeatherAndWaterStatusSlice {
    WeatherAndWaterStatus: [{ [locationId: string]: WeatherAndWaterStatus }];
}

const initialState: WeatherAndWaterStatusSlice = {
    WeatherAndWaterStatus: [{}]
}


const weatherAndWaterStatusSlice = createSlice({
    name: 'weatherAndWaterStatus',
    initialState,

    reducers: {
        registerWeatherAndWaterStatus(state, action: PayloadAction<{ [locationId: string]: WeatherAndWaterStatus }>) {
            state.WeatherAndWaterStatus.push(action.payload);
        }
    }
})

export const { registerWeatherAndWaterStatus } = weatherAndWaterStatusSlice.actions
export default weatherAndWaterStatusSlice.reducer
