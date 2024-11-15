import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {Fpf} from "../models/Fpf";

//hier wird der API Client aufgerufen
//anstatt useAuth, getUser verwenden und den token auslesen
// Hier die gesammte URL zusammenbauen (aus env ziehen)



export const receiveFpfData = (fpfID:number, from:Date, to:Date) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/fpfs/${fpfID}/data?from=${from}&to=${to}`;
    const result:  Promise<Fpf[]> = apiClient.get(url, headers)

    return result
}