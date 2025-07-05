import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Measurement} from "../models/measurement";
import {BACKEND_URL} from "../../../env-config";
import {getIsoStringFromDate} from "../../../utils/utils";


export const requestMeasuremnt = (sensorID:string, from?:string, to?:string) => {
    if (!from) {
        const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - 1);

        // %Y-%m-%dT%H:%M:%SZ'
        // Formatierung des Datums im Format YYYY-MM-DD
        from = getIsoStringFromDate(pastDate);
    }

    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    let url = `${BACKEND_URL}/api/sensors/${sensorID}/measurements?from=${from}`;
    if (to) {
        url += `&to=${to}`;
    }

    const result:  Promise<Measurement[]> = apiClient.get(url, headers)
    return result
}