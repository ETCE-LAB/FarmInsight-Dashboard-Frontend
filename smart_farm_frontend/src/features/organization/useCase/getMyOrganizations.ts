import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {OrganizationMembership} from "../models/Organization";
import {BACKEND_URL} from "../../../env-config";


export const getMyOrganizations = () => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/organizations/own`;

    const result:  Promise<OrganizationMembership[]> = apiClient.get(url, headers)
    return result
}
