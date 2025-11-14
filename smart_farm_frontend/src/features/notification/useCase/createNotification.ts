import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {Notification} from "../models/notification";

/**
 * Create a new notification room.
 * 
 * API Endpoint: POST /api/notifications/create
 * Authentication: Required (Bearer token)
 * Permissions: System admin only
 * 
 * Parameters:
 *   data (Notification) - Object containing room_id and name
 * 
 * Returns:
 *   Promise<any> - The created notification object
 * 
 * Flow:
 *   1. Get authentication token from user session
 *   2. Make POST request with notification data
 *   3. Backend validates data and creates record
 *   4. Return created notification
 * 
 * Error Cases:
 *   - 403 if user is not system admin
 *   - 400 if room_id already exists or data is invalid
 */
export const createNotification = (data: Notification) => {
    const apiClient = new APIClient();

    const headers = {
        'Authorization': `Bearer ${getUser()?.access_token}`
    };

    const url = `${BACKEND_URL}/api/notifications/create`;

    return apiClient.post(url, data, headers);
}
