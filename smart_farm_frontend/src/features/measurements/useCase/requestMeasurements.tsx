import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Measurement} from "../models/measurement";
import {BACKEND_URL} from "../../../env-config";

//8250f7569a3047ea8decf4cc101003da
//"2017-07-21T17:32:28Z
////"2017-07-21
export const requestMeasuremnt = (sensorID:string, from?:string, to?:string) => {
    if (!from) {
        const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - 1);

        // %Y-%m-%dT%H:%M:%SZ'
        // Formatierung des Datums im Format YYYY-MM-DD
        const year = pastDate.getFullYear();
        const month = String(pastDate.getMonth() + 1).padStart(2, '0');
        const day = String(pastDate.getDate()).padStart(2, '0');
        const hour = String(pastDate.getHours()).padStart(2, '0');
        const minute = String(pastDate.getMinutes()).padStart(2, '0');
        const second = String(pastDate.getSeconds()).padStart(2, '0');

        from = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }

    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}
    let url = ""
    if(to) {
        url = `${BACKEND_URL}/api/sensors/${sensorID}/measurements?from=${from}&to=${to}`;
    }
    else {
        url = `${BACKEND_URL}/api/sensors/${sensorID}/measurements?from=${from}`;
    }

    const result:  Promise<Measurement[]> = apiClient.get(url, headers)
    return result
}