import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const setUserprofileActiveState = (userprofileId: string, active: boolean) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/admin/set-active/${userprofileId}`;
    const data = {
        active: active
    }

    return apiClient.post(url, data, headers);
}
