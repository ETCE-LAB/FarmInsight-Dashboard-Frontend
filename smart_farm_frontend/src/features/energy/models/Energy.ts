/**
 * Linked Sensor Summary - minimal sensor info for display
 */
export interface LinkedSensorSummary {
    id: string;
    name: string;
    unit: string;
    parameter: string;
    isActive: boolean;
}

/**
 * Linked ControllableAction Summary - minimal action info for display
 */
export interface LinkedActionSummary {
    id: string;
    name: string;
    isActive: boolean;
    isAutomated: boolean;
}

/**
 * Energy Consumer - represents an energy consuming device within an FPF
 */
export interface EnergyConsumer {
    id: string;
    name: string;
    consumptionWatts: number;
    priority: number; // 1-10, 1 = critical, 10 = optional
    shutdownThreshold: number; // Battery % at which to shutdown (0 = use global thresholds)
    dependencyIds: string[];
    dependencies?: EnergyConsumerSummary[];
    sensorId?: string | null; // Link to sensor for live power measurement
    sensor?: LinkedSensorSummary | null;
    controllableActionId?: string | null; // Link to action for automatic control
    controllableAction?: LinkedActionSummary | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface EnergyConsumerSummary {
    id: string;
    name: string;
    consumptionWatts: number;
    priority: number;
    shutdownThreshold: number;
    isActive: boolean;
}

export interface CreateEnergyConsumer {
    fpfId: string;
    name: string;
    consumptionWatts: number;
    priority: number;
    shutdownThreshold?: number;
    dependencyIds?: string[];
    sensorId?: string | null;
    controllableActionId?: string | null;
    isActive: boolean;
}

export interface UpdateEnergyConsumer {
    name?: string;
    consumptionWatts?: number;
    priority?: number;
    shutdownThreshold?: number;
    dependencyIds?: string[];
    sensorId?: string | null;
    controllableActionId?: string | null;
    isActive?: boolean;
}

/**
 * Energy Source - represents an energy source within an FPF
 */
export type EnergySourceType = 'solar' | 'wind' | 'grid' | 'battery' | 'generator';

export interface EnergySource {
    id: string;
    name: string;
    sourceType: EnergySourceType;
    maxOutputWatts: number;
    currentOutputWatts: number;
    weatherDependent: boolean;
    sensorId?: string | null; // Link to sensor for live power measurement
    sensor?: LinkedSensorSummary | null;
    controllableActionId?: string | null; // Link to action for control (e.g., grid switch)
    controllableAction?: LinkedActionSummary | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateEnergySource {
    fpfId: string;
    name: string;
    sourceType: EnergySourceType;
    maxOutputWatts: number;
    currentOutputWatts?: number;
    weatherDependent: boolean;
    sensorId?: string | null;
    controllableActionId?: string | null;
    isActive: boolean;
}

export interface UpdateEnergySource {
    name?: string;
    sourceType?: EnergySourceType;
    maxOutputWatts?: number;
    currentOutputWatts?: number;
    weatherDependent?: boolean;
    sensorId?: string | null;
    controllableActionId?: string | null;
    isActive?: boolean;
}

/**
 * Energy State - represents the current energy state of an FPF
 */
export type EnergyAction =
    | 'normal'
    | 'connect_grid'
    | 'disconnect_grid'
    | 'shutdown_non_critical'
    | 'emergency_shutdown';

export type EnergyStatus = 'normal' | 'warning' | 'critical';

export interface EnergyState {
    fpf_id: string;
    battery: {
        level_wh: number;
        percentage: number;
        max_wh: number;
    };
    power: {
        consumption_watts: number;
        production_watts: number;
        net_watts: number;
    };
    grid_connected: boolean;
    action: EnergyAction;
    consumers_to_shutdown: string[];
    status: EnergyStatus;
    message: string;
    thresholds: {
        grid_connect: number;
        shutdown: number;
        warning: number;
        grid_disconnect: number;
    };
}

/**
 * Energy Balance - historical energy data
 */
export interface EnergyDataPoint {
    timestamp: string;
    watts: number;
}

export interface EnergyBalance {
    fpf_id: string;
    from_date: string;
    to_date: string;
    consumption: {
        data: EnergyDataPoint[];
        total_wh: number;
    };
    production: {
        data: EnergyDataPoint[];
        total_wh: number;
    };
    net_wh: number;
}

/**
 * Energy Dashboard - combined view of all energy data
 */
export interface EnergyDashboard {
    fpf_id: string;
    consumers: {
        list: EnergyConsumer[];
        total_consumption_watts: number;
        count: number;
    };
    sources: {
        list: EnergySource[];
        total_available_watts: number;
        current_output_watts: number;
        count: number;
    };
    state: EnergyState;
    estimated_runtime_hours: number | null;
    thresholds: {
        grid_connect_percent: number;
        shutdown_percent: number;
        warning_percent: number;
        grid_disconnect_percent: number;
        battery_max_wh: number;
    };
}

/**
 * Energy Action Evaluation Response
 */
export interface EnergyActionResponse {
    action: EnergyAction;
    status: EnergyStatus;
    message: string;
    battery_percentage: number;
    grid_connected: boolean;
    consumers_to_shutdown: string[];
    executed: boolean;
    execution_message?: string;
    actions_queued?: string[];
    execution_errors?: string[];
}

/**
 * Energy Thresholds Configuration
 */
export interface EnergyThresholds {
    gridConnectPercent: number;
    shutdownPercent: number;
    warningPercent: number;
    gridDisconnectPercent: number;
    batteryMaxWh: number;
}

/**
 * Default thresholds matching backend configuration
 */
export const DEFAULT_ENERGY_THRESHOLDS: EnergyThresholds = {
    gridConnectPercent: 11,
    shutdownPercent: 10,
    warningPercent: 20,
    gridDisconnectPercent: 50,
    batteryMaxWh: 1600 // 1.6 kWh in Wh
};
