import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const postFpfOrder = (orgId: string, data: string[]) => {
    const apiClient = new APIClient()

    const headers =
        {'Authorization': `Bearer ${getUser()?.access_token}`}

    const url = `${BACKEND_URL}/api/fpfs/sort-order/${orgId}`;

    return apiClient.post(url, data, headers);
};