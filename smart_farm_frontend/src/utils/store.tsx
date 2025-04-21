import {configureStore} from "@reduxjs/toolkit";
import UserProfileSlice from "../features/userProfile/state/UserProfileSlice";
import OrganizationSlice from "../features/organization/state/OrganizationSlice";
import FpfSlice from "../features/fpf/state/FpfSlice";
import SensorSlice from "../features/sensor/state/SensorSlice";
import measurementSlice from "../features/measurements/state/measurementSlice";
import authSlice from "../features/auth/slice/authSlice";
import MembershipSlice from "../features/membership/state/MembershipSlice";
import CameraSlice from "../features/camera/state/CameraSlice";
import GrowingCycleSlice from "../features/growthCycle/state/GrowingCycleSlice";
import LocationSlice from "../features/location/state/LocationSlice";
import ControllableActionSlice from "../features/controllables/state/ControllableActionSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        userProfile : UserProfileSlice,
        organization :OrganizationSlice,
        sensor: SensorSlice,
        fpf : FpfSlice,
        measurement: measurementSlice,
        membership: MembershipSlice,
        growingCycle: GrowingCycleSlice,
        camera: CameraSlice,
        controllableAction: ControllableActionSlice,
        location: LocationSlice
    }
})

export type RootState = ReturnType<typeof   store.getState>

export type AppDispatch = typeof store.dispatch;

export default store;