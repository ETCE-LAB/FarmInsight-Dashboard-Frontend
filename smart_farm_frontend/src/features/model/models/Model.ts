export interface Model {
    id:string,
    name:string,
    URL:string,
    intervalSeconds:number,
    isActive:boolean,
    required_parameters:
        {
        name: string,
        type: string, // ENUM "static" or "sensor"
        value: any // number, string or uuid
        }[],
    activeScenario:string,
    availableScenarios:string[],
    fpfId:string,
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
    forecasts: {
        name: string // Name of the forecast e.g. "Water level in tank"
    }[],
    required_parameters:
        {
        name: string,
        type: string, // ENUM "static" or "sensor"
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