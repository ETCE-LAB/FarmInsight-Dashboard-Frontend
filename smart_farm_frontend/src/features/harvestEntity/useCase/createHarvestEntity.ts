import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {HarvestEntity} from "../models/harvestEntity";
import {BACKEND_URL} from "../../../env-config";

//8250f7569a3047ea8decf4cc101003da
//"2017-07-21T17:32:28Z
////"2017-07-21
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