import {getUser} from "../../../utils/getUser";
import APIClient from "../../../utils/APIClient";
import {Fpf} from "../models/Fpf";
import {BACKEND_URL} from "../../../env-config";


export const getFpf = (fpfID: string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}


    const url = `${BACKEND_URL}/api/fpfs/${fpfID}`;
    const result:  Promise<Fpf> = apiClient.get(url, headers)

    return result
}