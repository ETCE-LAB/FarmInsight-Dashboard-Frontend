import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Organization} from "../models/Organization";
import {BACKEND_URL} from "../../../env-config";

export const addUserToOrganization = async (data: { organizationId:string, userprofileId:string, membershipRole:string }) => {
    try {
        //const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organizations`, {
        const apiClient = new APIClient()
        const user = getUser();
        const token = user?.access_token;
        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${BACKEND_URL}/api/memberships`;
        const response:Organization = await apiClient.post(url, data, headers);

        return response;
    }
    catch (error) {
        console.error("Error: " + error);
    }
};