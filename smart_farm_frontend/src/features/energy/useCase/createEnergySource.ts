import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { CreateEnergySource, EnergySource } from "../models/Energy";
import { BACKEND_URL } from "../../../env-config";

export const createEnergySource = async (data: CreateEnergySource): Promise<EnergySource> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-sources`;

    return apiClient.post(url, data, headers);
};
