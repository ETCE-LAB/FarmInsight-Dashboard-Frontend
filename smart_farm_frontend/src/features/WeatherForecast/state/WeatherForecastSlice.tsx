import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {WeatherForecast} from "../models/WeatherForecast";


//Currently: 2 States, Logged in and not logged in
interface WeatherForcastSlice {
    //Key: FpfId, Value: WeatherForecast[] -> List of WeatherForecasts for each Fpf
    WeatherForecasts: [{[locationId: string]: WeatherForecast[]}];
}

//At beginning, the user is not logged in
const initialState: WeatherForcastSlice = {
    WeatherForecasts: [{}]
}


const weatherForecastSlice = createSlice({
    name: 'weatherForecasts',
    initialState,

    reducers: {
        registerWeatherForecasts(state, action: PayloadAction<{[locationId: string]: WeatherForecast[]}>) {
            state.WeatherForecasts.push(action.payload);
        }
    }
})

export const {registerWeatherForecasts} = weatherForecastSlice.actions
export default weatherForecastSlice.reducer