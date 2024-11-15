import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Fpf} from "../../fpf/models/Fpf";

export const kickMember = async (data: { id:string }) => {
    try {

        const apiClient = new APIClient()

        const user = getUser();
        const token = user?.access_token;

        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/memberships/${data.id}`;
        const response:Fpf = await apiClient.delete(url, headers);

        return response
    }
    catch (error) {
        console.error("Error: " + error);
    }
};