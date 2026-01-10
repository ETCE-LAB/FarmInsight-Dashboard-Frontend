/**
 * EnergyResource - Adapter for the Energy module
 * 
 * Thin adapter that delegates all operations to existing useCase functions.
 * No new business logic is added; this is purely a wrapper for polymorphic access.
 */

import { AbstractResource, ResourceNotImplementedError } from './AbstractResource';
import {
    EnergyState,
    EnergySource,
    EnergyConsumer,
    EnergyDashboard,
    CreateEnergySource,
    CreateEnergyConsumer,
    UpdateEnergySource,
    UpdateEnergyConsumer
} from '../../features/energy/models/Energy';
import { EnergyConfig, EnergyConfigUpdate } from '../../features/energy/useCase/updateEnergyConfig';

// Import existing useCase functions
import { getEnergyState, getEnergyDashboard } from '../../features/energy/useCase/getEnergyState';
import { getEnergySources } from '../../features/energy/useCase/getEnergySources';
import { getEnergyConsumers } from '../../features/energy/useCase/getEnergyConsumers';
import { createEnergySource } from '../../features/energy/useCase/createEnergySource';
import { createEnergyConsumer } from '../../features/energy/useCase/createEnergyConsumer';
import { updateEnergySource, deleteEnergySource } from '../../features/energy/useCase/updateEnergySource';
import { updateEnergyConsumer, deleteEnergyConsumer } from '../../features/energy/useCase/updateEnergyConsumer';
import { updateEnergyConfig, getEnergyConfig } from '../../features/energy/useCase/updateEnergyConfig';

/**
 * Energy resource adapter implementing the AbstractResource interface.
 * All methods delegate directly to existing energy useCase functions.
 */
export class EnergyResource extends AbstractResource<
    EnergyState,
    EnergyConfig,
    EnergySource,
    EnergyConsumer,
    CreateEnergySource,
    CreateEnergyConsumer,
    UpdateEnergySource,
    UpdateEnergyConsumer
> {
    readonly resourceKey = 'energy';
    readonly displayName = 'Energy';
    readonly capabilities = {
        sources: true,
        consumers: true,
        config: true
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // State Access
    // ─────────────────────────────────────────────────────────────────────────────

    async getState(fpfId: string, additionalParams?: Record<string, unknown>): Promise<EnergyState> {
        const batteryLevelWh = (additionalParams?.batteryLevelWh as number) ?? 800; // Default 50% of 1600
        return getEnergyState(fpfId, batteryLevelWh);
    }

    /**
     * Gets the complete energy dashboard data including sources, consumers, state, and thresholds.
     * This is an Energy-specific method not part of the abstract interface.
     */
    async getDashboard(fpfId: string, batteryLevelWh?: number): Promise<EnergyDashboard> {
        return getEnergyDashboard(fpfId, batteryLevelWh);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Sources
    // ─────────────────────────────────────────────────────────────────────────────

    async getSources(fpfId: string): Promise<EnergySource[]> {
        const response = await getEnergySources(fpfId);
        return response.sources;
    }

    async createSource(data: CreateEnergySource): Promise<EnergySource> {
        return createEnergySource(data);
    }

    async updateSource(sourceId: string, data: UpdateEnergySource): Promise<EnergySource> {
        return updateEnergySource(sourceId, data);
    }

    async deleteSource(sourceId: string): Promise<void> {
        return deleteEnergySource(sourceId);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Consumers
    // ─────────────────────────────────────────────────────────────────────────────

    async getConsumers(fpfId: string): Promise<EnergyConsumer[]> {
        const response = await getEnergyConsumers(fpfId);
        return response.consumers;
    }

    async createConsumer(data: CreateEnergyConsumer): Promise<EnergyConsumer> {
        return createEnergyConsumer(data);
    }

    async updateConsumer(consumerId: string, data: UpdateEnergyConsumer): Promise<EnergyConsumer> {
        return updateEnergyConsumer(consumerId, data);
    }

    async deleteConsumer(consumerId: string): Promise<void> {
        return deleteEnergyConsumer(consumerId);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Configuration
    // ─────────────────────────────────────────────────────────────────────────────

    async updateConfig(fpfId: string, config: Partial<EnergyConfigUpdate>): Promise<EnergyConfig> {
        return updateEnergyConfig(fpfId, config);
    }

    async getConfig(fpfId: string): Promise<EnergyConfig> {
        return getEnergyConfig(fpfId);
    }
}

// Singleton instance for convenience
export const energyResource = new EnergyResource();

