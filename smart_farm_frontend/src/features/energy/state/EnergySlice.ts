import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../utils/store";
import { 
    EnergyConsumer, 
    EnergySource, 
    EnergyState, 
    EnergyDashboard,
    DEFAULT_ENERGY_THRESHOLDS 
} from "../models/Energy";

interface EnergySliceState {
    consumers: EnergyConsumer[];
    sources: EnergySource[];
    energyState: EnergyState | null;
    dashboard: EnergyDashboard | null;
    batteryLevelWh: number;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number;
}

const initialState: EnergySliceState = {
    consumers: [],
    sources: [],
    energyState: null,
    dashboard: null,
    batteryLevelWh: DEFAULT_ENERGY_THRESHOLDS.batteryMaxWh * 0.5, // Default to 50%
    isLoading: false,
    error: null,
    lastUpdated: 0
};

const energySlice = createSlice({
    name: 'energy',
    initialState,

    reducers: {
        setEnergyConsumers(state, action: PayloadAction<EnergyConsumer[]>) {
            state.consumers = action.payload;
            state.lastUpdated = Date.now();
        },
        
        addEnergyConsumer(state, action: PayloadAction<EnergyConsumer>) {
            state.consumers.push(action.payload);
            state.lastUpdated = Date.now();
        },
        
        updateEnergyConsumer(state, action: PayloadAction<EnergyConsumer>) {
            const index = state.consumers.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.consumers[index] = action.payload;
                state.lastUpdated = Date.now();
            }
        },
        
        removeEnergyConsumer(state, action: PayloadAction<string>) {
            state.consumers = state.consumers.filter(c => c.id !== action.payload);
            state.lastUpdated = Date.now();
        },
        
        setEnergySources(state, action: PayloadAction<EnergySource[]>) {
            state.sources = action.payload;
            state.lastUpdated = Date.now();
        },
        
        addEnergySource(state, action: PayloadAction<EnergySource>) {
            state.sources.push(action.payload);
            state.lastUpdated = Date.now();
        },
        
        updateEnergySource(state, action: PayloadAction<EnergySource>) {
            const index = state.sources.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.sources[index] = action.payload;
                state.lastUpdated = Date.now();
            }
        },
        
        removeEnergySource(state, action: PayloadAction<string>) {
            state.sources = state.sources.filter(s => s.id !== action.payload);
            state.lastUpdated = Date.now();
        },
        
        setEnergyState(state, action: PayloadAction<EnergyState>) {
            state.energyState = action.payload;
            state.lastUpdated = Date.now();
        },
        
        setEnergyDashboard(state, action: PayloadAction<EnergyDashboard>) {
            state.dashboard = action.payload;
            state.consumers = action.payload.consumers.list;
            state.sources = action.payload.sources.list;
            state.energyState = action.payload.state;
            state.lastUpdated = Date.now();
        },
        
        setBatteryLevel(state, action: PayloadAction<number>) {
            state.batteryLevelWh = action.payload;
        },
        
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        
        clearEnergyData(state) {
            state.consumers = [];
            state.sources = [];
            state.energyState = null;
            state.dashboard = null;
            state.error = null;
        }
    }
});

export const {
    setEnergyConsumers,
    addEnergyConsumer,
    updateEnergyConsumer,
    removeEnergyConsumer,
    setEnergySources,
    addEnergySource,
    updateEnergySource,
    removeEnergySource,
    setEnergyState,
    setEnergyDashboard,
    setBatteryLevel,
    setLoading,
    setError,
    clearEnergyData
} = energySlice.actions;

// Selectors
export const selectEnergyConsumers = (state: RootState) => state.energy.consumers;
export const selectEnergySources = (state: RootState) => state.energy.sources;
export const selectEnergyState = (state: RootState) => state.energy.energyState;
export const selectEnergyDashboard = (state: RootState) => state.energy.dashboard;
export const selectBatteryLevel = (state: RootState) => state.energy.batteryLevelWh;
export const selectEnergyLoading = (state: RootState) => state.energy.isLoading;
export const selectEnergyError = (state: RootState) => state.energy.error;

// Computed selectors
export const selectTotalConsumption = (state: RootState) => 
    state.energy.consumers
        .filter(c => c.isActive)
        .reduce((sum, c) => sum + c.consumptionWatts, 0);

export const selectTotalProduction = (state: RootState) =>
    state.energy.sources
        .filter(s => s.isActive)
        .reduce((sum, s) => sum + s.currentOutputWatts, 0);

export const selectNetPower = (state: RootState) =>
    selectTotalProduction(state) - selectTotalConsumption(state);

export const selectBatteryPercentage = (state: RootState) => {
    const batteryWh = state.energy.batteryLevelWh;
    const maxWh = state.energy.dashboard?.thresholds.battery_max_wh || DEFAULT_ENERGY_THRESHOLDS.batteryMaxWh;
    return Math.min(100, Math.max(0, (batteryWh / maxWh) * 100));
};

export default energySlice.reducer;
