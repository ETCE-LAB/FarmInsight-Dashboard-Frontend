import APIClient from "../../utils/APIClient";
import {getUser} from "../getUser";
import {BACKEND_URL} from "../../env-config";


export const getWebSocketToken = () => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/websocket-token`;

    const result= apiClient.get(url, headers)

    return result
}