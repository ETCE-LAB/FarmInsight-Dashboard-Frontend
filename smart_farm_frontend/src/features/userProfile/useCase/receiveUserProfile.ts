import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {UserProfile} from "../models/UserProfile";
import {BACKEND_URL} from "../../../env-config";


export const receiveUserProfile = () => {
    const apiClient = new APIClient()

    const user = getUser();
    if (user) {
        const token = user.access_token;

        const headers =
            {'Authorization': `Bearer ${token}`}

        const url = `${BACKEND_URL}/api/userprofiles`;
        const result:  Promise<UserProfile> = apiClient.get(url, headers)

        return result
    }
    else {
        return Promise.reject("Not logged in")
    }
}






