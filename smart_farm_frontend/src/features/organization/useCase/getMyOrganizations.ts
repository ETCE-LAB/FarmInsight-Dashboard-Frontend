import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Organization} from "../models/Organization";
import {BACKEND_URL} from "../../../env-config";


export const getMyOrganizations = () => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}


    const url = `${BACKEND_URL}/api/organizations/own`;
    const result:  Promise<Organization[]> = apiClient.get(url, headers)

    return result
}
