import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";
import {ActionScriptField} from "../ui/controllableActionForm";

export const fetchAvailableActionScripts = () => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/action-scripts/types`;
    const result:  Promise<{action_script_class_id:string, name:string, description:string, action_values:[], fields:ActionScriptField[]}[]> = apiClient.get(url, headers)

    return result
}