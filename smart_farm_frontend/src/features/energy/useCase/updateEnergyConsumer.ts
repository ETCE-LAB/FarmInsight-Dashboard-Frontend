import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { UpdateEnergyConsumer, EnergyConsumer } from "../models/Energy";
import { BACKEND_URL } from "../../../env-config";

export const updateEnergyConsumer = async (consumerId: string, data: UpdateEnergyConsumer): Promise<EnergyConsumer> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-consumers/${consumerId}`;

    return apiClient.put(url, data, headers);
};

export const deleteEnergyConsumer = async (consumerId: string): Promise<void> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-consumers/${consumerId}`;

    await apiClient.delete(url, headers);
};
