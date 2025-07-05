import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {BACKEND_URL} from "../../../env-config";
import {Location} from "../models/location"


export const getLocationByOrganization = (organizationId: string) => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const url = `${BACKEND_URL}/api/locations/organization/${organizationId}`;

    const response: Promise<Location[]> = apiClient.get(url, headers);
    return response;
}