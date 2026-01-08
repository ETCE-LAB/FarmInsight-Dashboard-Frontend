import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { EnergyConsumer } from "../models/Energy";
import { BACKEND_URL } from "../../../env-config";

interface EnergyConsumersResponse {
    consumers: EnergyConsumer[];
    total_consumption_watts: number;
}

export const getEnergyConsumers = async (fpfId: string): Promise<EnergyConsumersResponse> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-consumers/fpf/${fpfId}`;

    return apiClient.get(url, headers);
};
