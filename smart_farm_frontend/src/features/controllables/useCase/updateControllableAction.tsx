import {ControllableAction, EditControllableAction} from "../models/controllableAction";
import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";



export const updateControllableAction = async (action:EditControllableAction) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;
    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/controllable-actions/${action.id}`;
    const result: ControllableAction = await apiClient.put(url, action, headers)

    return result


}