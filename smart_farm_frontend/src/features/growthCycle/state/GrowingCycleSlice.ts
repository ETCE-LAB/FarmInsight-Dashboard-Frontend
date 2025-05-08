import {createSlice, PayloadAction } from "@reduxjs/toolkit";
import {GrowingCycle} from "../models/growingCycle";
import {HarvestEntity} from "../../harvestEntity/models/harvestEntity";

interface GrowingCycleState{
    changeGrowingCycleEvent: number;
    growingCycles: GrowingCycle[];
}

const initialState: GrowingCycleState = {
    changeGrowingCycleEvent: 0,
    growingCycles: [],
}

const GrowingCycleSlice = createSlice({
    name: 'GrowingCycle',
    initialState,
    reducers: {
        changedGrowingCycle(state){
            state.changeGrowingCycleEvent += 1
        },
        setGrowingCycles(state, action: PayloadAction<GrowingCycle[]>) {
            state.growingCycles = action.payload;
        },
        addGrowingCycle(state, action: PayloadAction<GrowingCycle>) {
            state.growingCycles.push(action.payload);
        },
        updateGrowingCycle(state, action: PayloadAction<GrowingCycle>) {
            const index = state.growingCycles.findIndex(cycle => cycle.id === action.payload.id);
            if (index !== -1) {
                state.growingCycles[index] = action.payload;
            }
        },
        deleteGrowingCycle(state, action: PayloadAction<string>) {
            state.growingCycles = state.growingCycles.filter(cycle => cycle.id !== action.payload);
        },
        addHarvestEntity(state, action: PayloadAction<{ cycleId: string, harvestEntity: HarvestEntity }>) {
          // Find the growing cycle with the given cycleId
          const cycle = state.growingCycles.find(
            (growingCycle) => growingCycle.id === action.payload.cycleId
          );
          if (cycle) {
            // Push the new harvest entity into the cycle's harvestEntities array
            if (!cycle.harvests) {
              cycle.harvests = []; // Initialize if undefined
            }
            cycle.harvests.push(action.payload.harvestEntity);
          }
        },
        updateHarvestEntity(state, action: PayloadAction<HarvestEntity>) {
          // Loop through all growing cycles to find the correct one
          for (let cycle of state.growingCycles) {
            const index = cycle.harvests?.findIndex(
              (entity) => entity.id === action.payload.id
            );
            if (index !== undefined && index !== -1) {
              cycle.harvests![index] = action.payload;
              break;
            }
          }
        },
        removeHarvestEntity(state, action: PayloadAction<{ cycleId: string, harvestId: string }>) {
          // Find the growing cycle and remove the harvest entity
          const cycle = state.growingCycles.find(
            (growingCycle) => growingCycle.id === action.payload.cycleId
          );
          if (cycle && cycle.harvests) {
            cycle.harvests = cycle.harvests.filter(
              (entity) => entity.id !== action.payload.harvestId
            );
          }
        },
      },
})

export const {changedGrowingCycle, setGrowingCycles, addGrowingCycle, updateGrowingCycle, deleteGrowingCycle, addHarvestEntity, updateHarvestEntity, removeHarvestEntity} = GrowingCycleSlice.actions
export default GrowingCycleSlice.reducer




