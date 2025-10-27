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
    action_values:[],
    fields:ActionScriptField[]
}