import APIClient from "../../../utils/APIClient";
import { getUser } from "../../../utils/getUser";
import { EnergyState, EnergyDashboard, EnergyActionResponse, EnergyConsumer, EnergySource, BatteryState, EnergyDashboardWithGraphData } from "../models/Energy";
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
 * Get complete energy dashboard data for an FPF (with optional graph data)
 */
export const getEnergyDashboard = async (
    fpfId: string,
    batteryLevelWh?: number,
    includeGraphData: boolean = true,
    hoursBack: number = 12,
    hoursAhead: number = 336
): Promise<EnergyDashboardWithGraphData> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const params = new URLSearchParams();
    if (batteryLevelWh !== undefined) {
        params.append('battery_level_wh', batteryLevelWh.toString());
    }
    params.append('include_graph_data', includeGraphData.toString());
    params.append('hours_back', hoursBack.toString());
    params.append('hours_ahead', hoursAhead.toString());

    const url = `${BACKEND_URL}/api/energy-dashboard/${fpfId}?${params.toString()}`;

    return apiClient.get(url, headers);
};

/**
 * Get the current battery state for an FPF
 */
export const getBatteryState = async (fpfId: string): Promise<BatteryState> => {
    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${BACKEND_URL}/api/battery-state/${fpfId}`;

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