import {createSlice} from "@reduxjs/toolkit";


//Currently: 2 States, Logged in and not logged in
interface AuthState{
    isLoggedIn: boolean;
}

//At beginning, the suer is not logged in
const initialState: AuthState = {
    isLoggedIn: false
}

//Über reducer Events verschicken
//reducer wäre der "Event-Bus"

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        login(state){
            state.isLoggedIn = true
        },
        logout(state){
            state.isLoggedIn=false
        }
    }
})

export const {login, logout} = authSlice.actions

export default authSlice.reducer