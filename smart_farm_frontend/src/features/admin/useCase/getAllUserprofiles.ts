import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {UserProfile} from "../../userProfile/models/UserProfile";


export const getAllUserprofiles = () => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/admin/userprofiles-all`;

    const result:  Promise<UserProfile[]> = apiClient.get(url, headers)
    return result
}
