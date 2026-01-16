import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { BACKEND_URL } from "../../../env-config";

export interface EnergyConfigUpdate {
    energyGridConnectThreshold?: number;
    energyShutdownThreshold?: number;
    energyWarningThreshold?: number;
    energyBatteryMaxWh?: number;
    energyGridDisconnectThreshold?: number;
}

export interface EnergyConfig {
    energyGridConnectThreshold: number;
    energyShutdownThreshold: number;
    energyWarningThreshold: number;
    energyBatteryMaxWh: number;
    energyGridDisconnectThreshold: number;
}

export const updateEnergyConfig = async (fpfId: string, config: EnergyConfigUpdate): Promise<EnergyConfig> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/fpfs/${fpfId}`;

    return apiClient.put(url, config, headers);
};

export const getEnergyConfig = async (fpfId: string): Promise<EnergyConfig> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/fpfs/${fpfId}`;

    const fpf = await apiClient.get(url, headers);
    return {
        energyGridConnectThreshold: fpf.energyGridConnectThreshold,
        energyShutdownThreshold: fpf.energyShutdownThreshold,
        energyWarningThreshold: fpf.energyWarningThreshold,
        energyBatteryMaxWh: fpf.energyBatteryMaxWh,
        energyGridDisconnectThreshold: fpf.energyGridDisconnectThreshold,
    };
};

