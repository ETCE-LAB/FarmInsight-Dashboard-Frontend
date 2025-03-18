import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";

export const createOrganization = async (data: { name: string; isPublic: boolean }) => {
    try {
        //const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organizations`, {
        const apiClient = new APIClient()
        const user = getUser();
        const token = user?.access_token;
        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${BACKEND_URL}/api/organizations`;
        const response = await apiClient.post(url, data, headers);


        return response;
}
    catch (error) {
        console.error("Error: " + error);
        return error
    }
};