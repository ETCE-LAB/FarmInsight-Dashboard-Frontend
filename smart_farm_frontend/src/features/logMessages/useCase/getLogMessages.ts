import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {LogMessage} from "../models/LogMessage";
import {BACKEND_URL} from "../../../env-config";


export const getLogMessages = (type:string, id?: string, amount?: number, from?: string, to?:string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {'Authorization': `Bearer ${token}`};

    if (!id) {
        id = 'None';
    }

    let query = '';
    if (from && to) {
        query = `from=${from}&to=${to}`;
    } else if (from) {
        query = `from=${from}`;
    } else if (amount) {
        query = `amount=${amount}`;
    } else {
        return Promise.reject(new Error("Invalid query params amount or from is required."));
    }

    const url = `${BACKEND_URL}/api/log_messages/${type}/${id}?${query}`;

    const result: Promise<LogMessage[]> = apiClient.get(url, headers);
    return result;
}

