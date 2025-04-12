import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {BACKEND_URL} from "../../../env-config";


export const getLocationByOrganization = async (organizationId: string | undefined) => {
    try {
        const apiClient = new APIClient();
        const user = getUser();
        const token = user?.access_token; // Fetch the access token of the logged-in user

        if (!token) {
            throw new Error("User token not found. Please log in.");
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure proper content type for JSON payload
        };

        const url = `${BACKEND_URL}/api/locations/organization/${organizationId}`; // Check if the URL matches the backend API

        const response = await apiClient.get(url, headers);

        return response;
    } catch (error) {
        console.error("Error fetching locations: ", error);
        throw error; // Propagate the error for further handling if needed
    }
}