import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {HarvestEntity} from "../models/harvestEntity";
import {BACKEND_URL} from "../../../env-config";


export const modifyHarvestEntity = (HarvestEntityID:string, data:HarvestEntity) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const url = `${BACKEND_URL}/api/harvests/${HarvestEntityID}`;

    const result:  Promise<HarvestEntity> = apiClient.put(url, data, headers)
    return result
}