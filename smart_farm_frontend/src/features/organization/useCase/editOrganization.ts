import APIClient from "../../../utils/APIClient";
import {Organization} from "../models/Organization";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";

// Define the UserProfile type if needed, or replace with your actual model/interface
interface UserProfile {
    id: string;
    name: string;
    role: string;
}

export const editOrganization = async (organization:Organization) => {
    try {
        const user = getUser();
        const apiClient = new APIClient();
        const token = user?.access_token; // Fetch the access token of the logged-in user

        if (!token) {
            throw new Error("User token not found. Please log in.");
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure proper content type for JSON payload
        };

        const url = `${BACKEND_URL}/api/organizations/`+organization.id; // Check if the URL matches the backend API

        const response: UserProfile = await apiClient.put(url, organization, headers);

        return response;
    } catch (error) {
        console.error("Error updating organization: ", error);
        throw error; // Propagate the error for further handling if needed
    }
};
