import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const postModelOrder = (fpfId: string, data: string[]) => {
    const apiClient = new APIClient()

    const headers =
        {'Authorization': `Bearer ${getUser()?.access_token}`}

    const url = `${BACKEND_URL}/api/models/sort-order/${fpfId}`;

    return apiClient.post(url, data, headers);
};