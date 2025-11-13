import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";

/**
 * Delete a notification room.
 * 
 * API Endpoint: DELETE /api/notifications/<room_id>
 * Authentication: Required (Bearer token)
 * Permissions: System admin only
 * 
 * Parameters:
 *   room_id (string) - The unique identifier of the notification room to delete
 * 
 * Returns:
 *   Promise<any> - Success response (200 OK)
 * 
 * Flow:
 *   1. Get authentication token from user session
 *   2. Make DELETE request
 *   3. Backend removes the notification record
 *   4. Return success
 * 
 * Error Cases:
 *   - 403 if user is not system admin
 *   - 404 if notification doesn't exist
 */
export const removeNotification = async (room_id: string) => {
    const apiClient = new APIClient();

    const headers = {
        'Authorization': `Bearer ${getUser()?.access_token}`
    };

    const url = `${BACKEND_URL}/api/notifications/${room_id}`;

    return await apiClient.delete(url, headers);
}
