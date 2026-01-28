import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { CreateEnergyConsumer, EnergyConsumer } from "../models/Energy";
import { BACKEND_URL } from "../../../env-config";

export const createEnergyConsumer = async (data: CreateEnergyConsumer): Promise<EnergyConsumer> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-consumers`;

    return apiClient.post(url, data, headers);
};
