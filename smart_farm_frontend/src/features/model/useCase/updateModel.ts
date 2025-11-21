import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {EditModel} from "../models/Model";
import {BACKEND_URL} from "../../../env-config";


export const updateModel = (data: EditModel) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/models/${data.id}`;

    return apiClient.put(url, data, headers);
}