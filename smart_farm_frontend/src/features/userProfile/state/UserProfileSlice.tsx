import {createSlice } from "@reduxjs/toolkit";
import {RootState} from "../../../utils/store";
import {UserProfile} from "../models/UserProfile";

//Currently: 2 States, Logged in and not logged in
interface UserProfileSlice {
    ownUserProfile: UserProfile;
    changedUserProfileEvent: number;
}

//At beginning, the suer is not logged in
const initialState: UserProfileSlice = {
    ownUserProfile: {id: '', name: '', email: '', systemRole: '', isActive: false},
    changedUserProfileEvent : 0
}

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,

    reducers: {
        receivedUserProfile(state, action: {payload: UserProfile}) {
            state.ownUserProfile = action.payload
        },
        changedUserProfile(state, action: {payload: UserProfile}) {
            state.ownUserProfile = action.payload
            state.changedUserProfileEvent += 1
        }
    }
})

export const {receivedUserProfile, changedUserProfile} = userProfileSlice.actions
export const changedUserProfileEvent = (state:RootState) => state.userProfile.changedUserProfileEvent;
export default userProfileSlice.reducer
