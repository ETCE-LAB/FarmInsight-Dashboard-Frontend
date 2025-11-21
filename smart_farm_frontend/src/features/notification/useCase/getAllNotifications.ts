import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";

/**
 * Fetch all notification rooms from the backend.
 * 
 * API Endpoint: GET /api/notifications
 * Authentication: Required (Bearer token)
 * 
 * Returns:
 *   Promise<any> - Array of notification objects
 * 
 * Flow:
 *   1. Get authentication token from user session
 *   2. Make GET request to backend
 *   3. Return list of all notifications
 */
export const getAllNotifications = async () => {
    const apiClient = new APIClient();

    const headers = {
        'Authorization': `Bearer ${getUser()?.access_token}`
    };

    const url = `${BACKEND_URL}/api/notifications`;

    return await apiClient.get(url, headers);
}
