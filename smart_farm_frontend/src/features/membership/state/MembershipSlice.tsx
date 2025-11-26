import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../../utils/store";

interface MembershipState{
    changeMembershipEvent: number;
}

const initialState: MembershipState = {
    changeMembershipEvent: 0
}

const membershipSlice = createSlice({
    name: 'membership',
    initialState,

    reducers: {
        changedMembership(state){
            state.changeMembershipEvent += 1
        }
    }
})

export const {changedMembership} = membershipSlice.actions
//export const changeMembershipEvent = (state:RootState) => state.membership.changeMembershipEvent;
export default membershipSlice.reducer




