export type ActionScriptField = {
    id: string;
    name: string;
    description: string;
    type: string;
    rules?: { name: string }[];
    defaultValue : any
}


export interface ActionScript {
    action_script_class_id:string,
    name:string,
    description:string,
    has_action_value: boolean,
    action_values:[],
    fields:ActionScriptField[]
}