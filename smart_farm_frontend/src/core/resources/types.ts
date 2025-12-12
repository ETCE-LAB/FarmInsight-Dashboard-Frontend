/**
 * Resource Module Types and Utilities
 */

import { AbstractResource } from './AbstractResource';
import { EnergyResource, energyResource } from './EnergyResource';
import { WaterResource, waterResource } from './WaterResource';

/**
 * Available resource types in the application
 */
export type ResourceType = 'water' | 'energy';

/**
 * Factory function to get a resource instance by type.
 * Useful for dynamically working with resources based on runtime values.
 * 
 * @param type - The resource type identifier
 * @returns The corresponding resource instance
 * @throws Error if resource type is not recognized
 * 
 * @example
 * ```typescript
 * const resource = getResourceInstance('energy');
 * const sources = await resource.getSources(fpfId);
 * ```
 */
export function getResourceInstance(type: ResourceType): AbstractResource<unknown, unknown, unknown, unknown> {
    switch (type) {
        case 'energy':
            return energyResource;
        case 'water':
            return waterResource;
        default:
            throw new Error(`Unknown resource type: ${type}`);
    }
}

/**
 * Get all available resource instances.
 * Useful for iterating over all resources in a dashboard view.
 */
export function getAllResourceInstances(): AbstractResource<unknown, unknown, unknown, unknown>[] {
    return [energyResource, waterResource];
}

/**
 * Type guard to check if a resource supports source operations
 */
export function supportsSourceOperations(
    resource: AbstractResource<unknown, unknown, unknown, unknown>
): boolean {
    return resource.supportsSourceOperations;
}

/**
 * Type guard to check if a resource supports consumer operations
 */
export function supportsConsumerOperations(
    resource: AbstractResource<unknown, unknown, unknown, unknown>
): boolean {
    return resource.supportsConsumerOperations;
}

/**
 * Type guard to check if a resource supports config operations
 */
export function supportsConfigOperations(
    resource: AbstractResource<unknown, unknown, unknown, unknown>
): boolean {
    return resource.supportsConfigOperations;
}

// Re-export concrete resource types for type-safe usage
export { EnergyResource, energyResource } from './EnergyResource';
export { WaterResource, waterResource } from './WaterResource';
export type { WaterSource, WaterConsumer, WaterConfig } from './WaterResource';
