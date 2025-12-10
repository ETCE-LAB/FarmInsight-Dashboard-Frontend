import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeatherAndTankStatus } from "../models/WeatherAndTankStatus";


interface WeatherAndTankStatusSlice {
    WeatherAndTankStatus: [{ [locationId: string]: WeatherAndTankStatus }];
}

const initialState: WeatherAndTankStatusSlice = {
    WeatherAndTankStatus: [{}]
}


const weatherAndTankStatusSlice = createSlice({
    name: 'weatherAndTankStatus',
    initialState,

    reducers: {
        registerWeatherAndTankStatus(state, action: PayloadAction<{ [locationId: string]: WeatherAndTankStatus }>) {
            state.WeatherAndTankStatus.push(action.payload);
        }
    }
})

export const { registerWeatherAndTankStatus } = weatherAndTankStatusSlice.actions
export default weatherAndTankStatusSlice.reducer