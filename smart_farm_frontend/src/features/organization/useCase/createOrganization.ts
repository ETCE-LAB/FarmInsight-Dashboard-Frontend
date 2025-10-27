import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const createOrganization = (data: { name: string; isPublic: boolean }) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/organizations`;

    const response = apiClient.post(url, data, headers);
    return response;
}