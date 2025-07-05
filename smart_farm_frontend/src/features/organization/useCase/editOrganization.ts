import APIClient from "../../../utils/APIClient";
import {Organization} from "../models/Organization";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {UserProfile} from "../../userProfile/models/UserProfile";


export const editOrganization = (organization:Organization) => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const url = `${BACKEND_URL}/api/organizations/${organization.id}`;

    const response: Promise<UserProfile> = apiClient.put(url, organization, headers);
    return response;
}
