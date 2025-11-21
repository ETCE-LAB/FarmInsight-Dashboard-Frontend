import {configureStore} from "@reduxjs/toolkit";
import UserProfileReducer from "../features/userProfile/state/UserProfileSlice";
import OrganizationReducer from "../features/organization/state/OrganizationSlice";
import FpfReducer from "../features/fpf/state/FpfSlice";
import SensorReducer from "../features/sensor/state/SensorSlice";
import measurementReducer from "../features/measurements/state/measurementSlice";
import authReducer from "../features/auth/slice/authSlice";
import MembershipReducer from "../features/membership/state/MembershipSlice";
import CameraReducer from "../features/camera/state/CameraSlice";
import GrowingCycleReducer from "../features/growthCycle/state/GrowingCycleSlice";
import LocationReducer from "../features/location/state/LocationSlice";
import ControllableActionReducer from "../features/controllables/state/ControllableActionSlice";
import WeatherForecastReducer from "../features/WeatherForecast/state/WeatherForecastSlice";
import ModelReducer from "../features/model/state/ModelSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        userProfile : UserProfileReducer,
        organization :OrganizationReducer,
        sensor: SensorReducer,
        fpf : FpfReducer,
        model : ModelReducer,
        measurement: measurementReducer,
        membership: MembershipReducer,
        growingCycle: GrowingCycleReducer,
        camera: CameraReducer,
        controllableAction: ControllableActionReducer,
        location: LocationReducer,
        weatherForecast: WeatherForecastReducer
    }
})

export type RootState = ReturnType<typeof   store.getState>

export type AppDispatch = typeof store.dispatch;

export default store;