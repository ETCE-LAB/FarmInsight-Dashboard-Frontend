/**
 * WaterResource - Adapter for the Water module
 * 
 * Thin adapter that delegates state access to the existing getWeatherAndWaterStatus useCase.
 * Source/Consumer/Config operations are not yet implemented in the backend,
 * so they throw ResourceNotImplementedError or return empty arrays as appropriate.
 */

import { AbstractResource, ResourceNotImplementedError } from './AbstractResource';
import { WeatherAndWaterStatus } from '../../features/water/models/WeatherAndWaterStatus';
import { getWeatherAndWaterStatus } from '../../features/water/useCase/getWeatherAndWaterStatus';

/**
 * Placeholder types for future Water module expansion.
 * When the backend supports water sources/consumers, these will be replaced
 * with actual model types similar to the Energy module.
 */
export interface WaterSource {
    id: string;
    name: string;
    type: 'rainwater' | 'well' | 'municipal' | 'recycled';
    flowRate?: number;
    isActive: boolean;
}

export interface WaterConsumer {
    id: string;
    name: string;
    type: 'irrigation' | 'greenhouse' | 'livestock' | 'processing';
    dailyUsage?: number;
    priority: number;
    isActive: boolean;
}

export interface WaterConfig {
    lowLevelThreshold: number;
    criticalLevelThreshold: number;
    maxCapacity: number;
}

/**
 * Water resource adapter implementing the AbstractResource interface.
 * 
 * The water module currently only supports getState via getWeatherAndWaterStatus.
 * All other operations throw ResourceNotImplementedError, clearly indicating
 * that these features are planned but not yet available.
 */
export class WaterResource extends AbstractResource<
    WeatherAndWaterStatus,
    WaterConfig,
    WaterSource,
    WaterConsumer,
    Partial<WaterSource>,
    Partial<WaterConsumer>,
    Partial<WaterSource>,
    Partial<WaterConsumer>
> {
    readonly resourceKey = 'water';
    readonly displayName = 'Water';

    // Capability flags - clearly indicate what's supported
    readonly supportsSourceOperations = false;
    readonly supportsConsumerOperations = false;
    readonly supportsConfigOperations = false;

    /**
     * Default sensor ID used when no specific sensor is provided.
     * This matches the hardcoded value in WaterDashboard.tsx.
     */
    private readonly defaultSensorId = 'f3c9187a-5d3b-4e2c-8b6f-1c2d3e4f5678';

    // ─────────────────────────────────────────────────────────────────────────────
    // State Access
    // ─────────────────────────────────────────────────────────────────────────────

    async getState(fpfId: string, additionalParams?: Record<string, unknown>): Promise<WeatherAndWaterStatus> {
        // fpfId is actually locationId for the water module
        const locationId = (additionalParams?.locationId as string) ?? fpfId;
        const sensorId = (additionalParams?.sensorId as string) ?? this.defaultSensorId;
        return getWeatherAndWaterStatus(locationId, sensorId);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Sources - Not yet implemented
    // ─────────────────────────────────────────────────────────────────────────────

    async getSources(_fpfId: string): Promise<WaterSource[]> {
        // Return empty array rather than throwing - allows UI to render gracefully
        return [];
    }

    async createSource(_data: Partial<WaterSource>): Promise<WaterSource> {
        throw new ResourceNotImplementedError(this.resourceKey, 'createSource');
    }

    async updateSource(_sourceId: string, _data: Partial<WaterSource>): Promise<WaterSource> {
        throw new ResourceNotImplementedError(this.resourceKey, 'updateSource');
    }

    async deleteSource(_sourceId: string): Promise<void> {
        throw new ResourceNotImplementedError(this.resourceKey, 'deleteSource');
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Consumers - Not yet implemented
    // ─────────────────────────────────────────────────────────────────────────────

    async getConsumers(_fpfId: string): Promise<WaterConsumer[]> {
        // Return empty array rather than throwing - allows UI to render gracefully
        return [];
    }

    async createConsumer(_data: Partial<WaterConsumer>): Promise<WaterConsumer> {
        throw new ResourceNotImplementedError(this.resourceKey, 'createConsumer');
    }

    async updateConsumer(_consumerId: string, _data: Partial<WaterConsumer>): Promise<WaterConsumer> {
        throw new ResourceNotImplementedError(this.resourceKey, 'updateConsumer');
    }

    async deleteConsumer(_consumerId: string): Promise<void> {
        throw new ResourceNotImplementedError(this.resourceKey, 'deleteConsumer');
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Configuration - Not yet implemented
    // ─────────────────────────────────────────────────────────────────────────────

    async updateConfig(_fpfId: string, _config: Partial<WaterConfig>): Promise<WaterConfig> {
        throw new ResourceNotImplementedError(this.resourceKey, 'updateConfig');
    }

    async getConfig(_fpfId: string): Promise<WaterConfig> {
        throw new ResourceNotImplementedError(this.resourceKey, 'getConfig');
    }
}

// Singleton instance for convenience
export const waterResource = new WaterResource();
