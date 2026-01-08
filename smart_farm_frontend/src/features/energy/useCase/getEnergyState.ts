import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { EnergyState, EnergyDashboard, EnergyActionResponse, EnergyConsumer, EnergySource } from "../models/Energy";
import { BACKEND_URL } from "../../../env-config";

/**
 * Get the current energy state for an FPF
 */
export const getEnergyState = async (fpfId: string, batteryLevelWh: number): Promise<EnergyState> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-state/${fpfId}?battery_level_wh=${batteryLevelWh}`;

    return apiClient.get(url, headers);
};

/**
 * Get complete energy dashboard data for an FPF
 */
export const getEnergyDashboard = async (fpfId: string, batteryLevelWh?: number): Promise<EnergyDashboard> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    let url = `${BACKEND_URL}/api/energy-dashboard/${fpfId}`;
    if (batteryLevelWh !== undefined) {
        url += `?battery_level_wh=${batteryLevelWh}`;
    }

    return apiClient.get(url, headers);
};

/**
 * Evaluate and optionally execute an energy management action
 */
export const evaluateEnergyAction = async (
    fpfId: string,
    batteryLevelWh: number,
    execute: boolean = false
): Promise<EnergyActionResponse> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-action/${fpfId}`;

    return apiClient.post(url, { battery_level_wh: batteryLevelWh, execute }, headers);
};

/**
 * Get all energy consumers for an FPF
 */
export const getEnergyConsumers = async (fpfId: string): Promise<{ consumers: EnergyConsumer[], total_consumption_watts: number }> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-consumers/fpf/${fpfId}`;

    return apiClient.get(url, headers);
};

/**
 * Get all energy sources for an FPF
 */
export const getEnergySources = async (fpfId: string): Promise<{ sources: EnergySource[], total_available_watts: number, current_output_watts: number }> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/energy-sources/fpf/${fpfId}`;

    return apiClient.get(url, headers);
};
