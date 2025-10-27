import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {UserProfile} from '../models/UserProfile';


export const modifyUserProfile = (data: { name: string }) => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    if (user) {
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        const url = `${BACKEND_URL}/api/userprofiles/${user.profile.sub}`;

        const response: Promise<UserProfile> = apiClient.put(url, data, headers);
        return response;
    } else {
        return Promise.reject("Not logged in")
    }
}
