import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { UpdateEnergySource, EnergySource } from "../models/Energy";
import { BACKEND_URL } from "../../../env-config";

export const updateEnergySource = async (sourceId: string, data: UpdateEnergySource): Promise<EnergySource> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-sources/${sourceId}`;

    return apiClient.put(url, data, headers);
};

export const deleteEnergySource = async (sourceId: string): Promise<void> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-sources/${sourceId}`;

    await apiClient.delete(url, headers);
};
