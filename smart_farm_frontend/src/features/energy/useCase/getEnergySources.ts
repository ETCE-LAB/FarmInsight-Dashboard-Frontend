import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { EnergySource } from "../models/Energy";
import { BACKEND_URL } from "../../../env-config";

interface EnergySourcesResponse {
    sources: EnergySource[];
    total_available_watts: number;
    current_output_watts: number;
}

export const getEnergySources = async (fpfId: string): Promise<EnergySourcesResponse> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-sources/fpf/${fpfId}`;

    return apiClient.get(url, headers);
};
