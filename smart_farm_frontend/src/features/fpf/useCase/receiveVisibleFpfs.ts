import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {BasicFPF} from "../models/BasicFPF";

//hier wird der API Client aufgerufen
//anstatt useAuth, getUser verwenden und den token auslesen
// Hier die gesammte URL zusammenbauen (aus env ziehen)

export const receiveVisibleFpfs = () => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {
            'Authorization': `Bearer ${token}`
        }

    const url = `https://farminsight-backend.etce.isse.tu-clausthal.de/api/fpfs/visible`;
    const result:  Promise<BasicFPF[]> = apiClient.get(url, headers)

    return result
}


