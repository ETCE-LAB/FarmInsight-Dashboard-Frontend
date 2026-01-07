import {Threshold} from "../../threshold/models/threshold";

export type ModelType = 'energy' | 'water';

export interface Model {
    id:string,
    name:string,
    URL:string,
    intervalSeconds:number,
    isActive:boolean,
    thresholds:Threshold[],
    required_parameters:
        {
        name: string,
        type: string, // ENUM "static" or "sensor"
        input_type: string,
        value: any // number, string or uuid
        }[],
    activeScenario:string,
    availableScenarios:string[],
    fpfId:string,
    model_type: ModelType,
    forecasts:
            {
                name: string // Scenario
                forecast:
                    {
                        timestamp: Date,
                        value:number,
                    }[],
            }[],
    actions:
        {
            name: string,
            controllable_action_id: string,
        }[] // TODO add the forecast of actions here
}

export interface EditModel {
    id:string,
    name:string,
    URL:string,
    intervalSeconds:number,
    activeScenario: string,
    isActive:boolean,
    model_type: ModelType,
    forecasts: {
        name: string // Name of the forecast e.g. "Water level in tank"
    }[],
    required_parameters:
        {
        name: string,
        type: string, // ENUM "static" or "sensor"
        input_type: string,
        value: any // number, string or uuid
        }[],
    availableScenarios:string[],
    fpfId:string,
    actions:
        {
            name: string,
            controllable_action_id: string,
        }[]// TODO add the forecast of actions here

}

// Return Type for getPrediction use case
//Yes this made it much easier to navigate
export interface ModelPrediction {
    fpf_id: string;
    models: ModelEntry[];
}

export interface ModelEntry {
    timestamp: string;
    modelId: string;
    modelName: string;
    data: ModelData;
}

export interface ModelData {
    forecasts: Forecast[];
    actions: ActionCase[];
}

export interface Forecast {
    name: string;
    values: ForecastCase[];
}

export interface ForecastCase {
    name: string; // best-case | average-case | worst-case
    value: ForecastValue[];
}

export interface ForecastValue {
    timestamp: string;
    value: number;
}

export interface ActionCase {
    name: string; // best-case | average-case | worst-case
    value: ActionValue[];
}

export interface ActionValue {
    timestamp: string;
    value: number;
    action: string;
}
