import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const getModelParams = async (modelURL: string): Promise<any> => {

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${BACKEND_URL}/api/models/params`;

    const response = await fetch(url, {
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({"URL": modelURL}),
    });

    return await response.json();

}