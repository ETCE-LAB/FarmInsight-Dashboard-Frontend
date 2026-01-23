/**
 * Abstract Resource Module
 * 
 * Provides a standardized interface for resource-like frontend modules.
 * Uses TypeScript generics to allow type-safe resource operations while delegating
 * to existing useCase functions.
 */

/**
 * Error thrown when a resource operation is not implemented for a specific resource type.
 * Used by resources where certain operations are not yet available.
 */
export class ResourceNotImplementedError extends Error {
    constructor(resourceKey: string, operation: string) {
        super(`Operation "${operation}" is not implemented for resource "${resourceKey}"`);
        this.name = 'ResourceNotImplementedError';
    }
}

/**
 * Interface defining what features a resource supports.
 */
export interface ResourceCapabilities {
    sources: boolean;
    consumers: boolean;
    config: boolean;
}

/**
 * Abstract base class for resource modules.
 * 
 * @typeParam TState - The state type returned by getState
 * @typeParam TConfig - The configuration type for updateConfig
 * @typeParam TSource - The source entity type
 * @typeParam TConsumer - The consumer entity type
 * @typeParam TCreateSource - The type for creating a source
 * @typeParam TCreateConsumer - The type for creating a consumer
 * @typeParam TUpdateSource - The type for updating a source
 * @typeParam TUpdateConsumer - The type for updating a consumer
 */
export abstract class AbstractResource<
    TState,
    TConfig,
    TSource,
    TConsumer,
    TCreateSource = Partial<TSource>,
    TCreateConsumer = Partial<TConsumer>,
    TUpdateSource = Partial<TSource>,
    TUpdateConsumer = Partial<TConsumer>
> {
    /**
     * Unique identifier for this resource type
     */
    abstract readonly resourceKey: string;

    /**
     * Human-readable display name for this resource
     */
    abstract readonly displayName: string;

    /**
     * Capabilities supported by this resource
     */
    abstract readonly capabilities: ResourceCapabilities;

    // ─────────────────────────────────────────────────────────────────────────────
    // State Access
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Retrieves the current state of the resource for a given FPF.
     * @param fpfId - The FPF identifier
     * @param additionalParams - Optional additional parameters specific to the resource
     */
    abstract getState(fpfId: string, additionalParams?: Record<string, unknown>): Promise<TState>;

    // ─────────────────────────────────────────────────────────────────────────────
    // Sources (Energy producers, Water inputs, etc.)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Retrieves all sources for a given FPF.
     * @param fpfId - The FPF identifier
     * @returns Array of sources, or empty array if not supported
     */
    abstract getSources(fpfId: string): Promise<TSource[]>;

    /**
     * Creates a new source.
     * @param data - The source data to create
     * @throws ResourceNotImplementedError if not supported
     */
    abstract createSource(data: TCreateSource): Promise<TSource>;

    /**
     * Updates an existing source.
     * @param sourceId - The source identifier
     * @param data - The source data to update
     * @throws ResourceNotImplementedError if not supported
     */
    abstract updateSource(sourceId: string, data: TUpdateSource): Promise<TSource>;

    /**
     * Deletes a source.
     * @param sourceId - The source identifier
     * @throws ResourceNotImplementedError if not supported
     */
    abstract deleteSource(sourceId: string): Promise<void>;

    // ─────────────────────────────────────────────────────────────────────────────
    // Consumers (Energy devices, Water outputs, etc.)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Retrieves all consumers for a given FPF.
     * @param fpfId - The FPF identifier
     * @returns Array of consumers, or empty array if not supported
     */
    abstract getConsumers(fpfId: string): Promise<TConsumer[]>;

    /**
     * Creates a new consumer.
     * @param data - The consumer data to create
     * @throws ResourceNotImplementedError if not supported
     */
    abstract createConsumer(data: TCreateConsumer): Promise<TConsumer>;

    /**
     * Updates an existing consumer.
     * @param consumerId - The consumer identifier
     * @param data - The consumer data to update
     * @throws ResourceNotImplementedError if not supported
     */
    abstract updateConsumer(consumerId: string, data: TUpdateConsumer): Promise<TConsumer>;

    /**
     * Deletes a consumer.
     * @param consumerId - The consumer identifier
     * @throws ResourceNotImplementedError if not supported
     */
    abstract deleteConsumer(consumerId: string): Promise<void>;

    // ─────────────────────────────────────────────────────────────────────────────
    // Configuration
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Updates the resource configuration for a given FPF.
     * @param fpfId - The FPF identifier
     * @param config - The configuration data to update
     * @throws ResourceNotImplementedError if not supported
     */
    abstract updateConfig(fpfId: string, config: Partial<TConfig>): Promise<TConfig>;

    /**
     * Retrieves the current configuration for a given FPF.
     * @param fpfId - The FPF identifier
     * @throws ResourceNotImplementedError if not supported
     */
    abstract getConfig(fpfId: string): Promise<TConfig>;
}
