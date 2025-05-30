import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const restUserProfilePasswords = (userprofileId: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/admin/password-reset/${userprofileId}`;

    const result:  Promise<string> = apiClient.get(url, headers)
    return result
}
