import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Organization} from "../models/Organization";
import {BACKEND_URL} from "../../../env-config";


export const addUserToOrganization = (data: { organizationId:string, userprofileId:string, membershipRole:string }) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/memberships`;

    const response: Promise<Organization> = apiClient.post(url, data, headers);
    return response;
}