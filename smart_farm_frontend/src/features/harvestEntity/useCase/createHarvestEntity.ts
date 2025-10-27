import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {HarvestEntity} from "../models/harvestEntity";
import {BACKEND_URL} from "../../../env-config";


export const createHarvestEntity = (data:HarvestEntity) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/harvests`;

    const result:  Promise<HarvestEntity> = apiClient.post(url, data, headers)
    return result
}