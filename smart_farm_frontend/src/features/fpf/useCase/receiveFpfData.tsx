import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {Fpf} from "../models/Fpf";
import {BACKEND_URL} from "../../../env-config";

//hier wird der API Client aufgerufen
//anstatt useAuth, getUser verwenden und den token auslesen
// Hier die gesammte URL zusammenbauen (aus env ziehen)



export const receiveFpfData = (fpfID: string, from: string, to: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const fromTest = "2024-09-20"
    const toTest = "2024-11-20"
    const url = `${BACKEND_URL}/api/fpfs/${fpfID}/data?from=${fromTest}&to=${toTest}`;
    const result:  Promise<Fpf> = apiClient.get(url, headers)

    return result
}