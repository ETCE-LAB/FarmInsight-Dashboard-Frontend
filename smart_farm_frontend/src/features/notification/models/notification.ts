/**
 * Notification model interface.
 *
 * Represents a notification room for push notifications.
 *
 * Properties:
 *   room_id: Unique identifier for the notification room (primary key in backend)
 *   name: Display name for the notification room
 */
export interface Notification {
    room_id: string;
    name: string;
}
