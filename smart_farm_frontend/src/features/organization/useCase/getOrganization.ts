import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Organization} from "../models/Organization";
import {BACKEND_URL} from "../../../env-config";


export const getOrganization = (identifier:string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/organizations/${identifier}`;
    const result:  Promise<Organization> = apiClient.get(url, headers)

    return result
}
