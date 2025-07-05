import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {UserProfile} from "../models/UserProfile";
import {BACKEND_URL} from "../../../env-config";


export const getUserProfilesBySearchString = (searchString: string, orgaId: string | undefined) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    let exclude = "";
    if (orgaId) {
        exclude = `?exclude_organization_id=${orgaId}`
    }

    const url = `${BACKEND_URL}/api/userprofiles/${searchString}${exclude}`;

    const result: Promise<UserProfile[]> = apiClient.get(url, headers)
    return result
}
