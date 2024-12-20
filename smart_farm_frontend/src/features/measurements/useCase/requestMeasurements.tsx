import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Measurement} from "../models/measurement";

//8250f7569a3047ea8decf4cc101003da
//"2017-07-21T17:32:28Z
////"2017-07-21
export const requestMeasuremnt = (sensorID:string, from:string, to?:string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}
    let url = ""
    if(to) {
        url = `${process.env.REACT_APP_BACKEND_URL}/api/sensors/${sensorID}/measurements?from=${from}&to=${to}`;
    }
    else {
        url = `${process.env.REACT_APP_BACKEND_URL}/api/sensors/${sensorID}/measurements?from=${from}`;
    }

    const result:  Promise<Measurement[]> = apiClient.get(url, headers)
    console.log(result)
    return result
}