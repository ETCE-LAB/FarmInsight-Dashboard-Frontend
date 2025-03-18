import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";

// Define the UserProfile type if needed, or replace with your actual model/interface
interface UserProfile {
    id: string;
    name: string;
    role: string;
}

export const modifyUserProfile = async (data: { name: string }) => {
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

        const url = `${BACKEND_URL}/api/userprofiles/`+user?.profile.sub; // Check if the URL matches the backend API

        // Use PUT for updates
        const response: UserProfile = await apiClient.put(url, data, headers);

        return response; // Return the updated profile
    } catch (error) {
        console.error("Error updating user profile: ", error);
        throw error; // Propagate the error for further handling if needed
    }
};
