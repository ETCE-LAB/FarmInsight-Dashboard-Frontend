import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../../utils/store";
import {Organization, OrganizationMembership} from "../models/Organization";


//Currently: 2 States, Logged in and not logged in
interface OrganizationState{
    createdOrganizationEvent: number;
    myOrganizations: OrganizationMembership[];
    selectedOrganization?: Organization;
}

//At beginning, the suer is not logged in
const initialState: OrganizationState = {
    createdOrganizationEvent: 0,
    myOrganizations: [],

}

const organizationSlice = createSlice({
    name: 'organization',
    initialState,

    reducers: {
        createdOrganization(state){
            state.createdOrganizationEvent += 1
        },
        storeMyOrganizations(state, action){
            state.myOrganizations = action.payload
        },
        storeSelectedOrganization(state, action){
            state.selectedOrganization = action.payload
        }
    }
})

export const {createdOrganization, storeMyOrganizations, storeSelectedOrganization} = organizationSlice.actions
export const createdOrganizationEvent = (state:RootState) => state.organization.createdOrganizationEvent;
export default organizationSlice.reducer




