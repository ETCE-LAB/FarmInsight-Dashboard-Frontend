
// Core abstract class and error
export { AbstractResource, ResourceNotImplementedError } from './AbstractResource';

// Concrete implementations
export { EnergyResource, energyResource } from './EnergyResource';
export { WaterResource, waterResource } from './WaterResource';

// Types and utilities
export type { ResourceType } from './types';
export {
    getResourceInstance,
    getAllResourceInstances,
    supportsSourceOperations,
    supportsConsumerOperations,
    supportsConfigOperations
} from './types';

// Re-export water types for consumers who need them
export type { WaterSource, WaterConsumer, WaterConfig } from './WaterResource';
