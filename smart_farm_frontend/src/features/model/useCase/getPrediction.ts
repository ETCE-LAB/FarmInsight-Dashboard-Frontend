import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ModelPrediction} from "../models/Model";


export const getPrediction = async (fpfId: string): Promise<ModelPrediction> => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/fpfs/${fpfId}/forecasts`;

    return await apiClient.get(url, headers);

}