import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ControllableAction, EditControllableAction} from "../models/controllableAction";


export const createControllableAction = (controllableAction:EditControllableAction) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/controllable-actions`;
    const result:  Promise<ControllableAction> = apiClient.post(url, controllableAction, headers)

    return result
}