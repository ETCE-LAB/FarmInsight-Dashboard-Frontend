import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";


export const deleteHarvestEntity = (harvestEntityID:string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/harvests/${harvestEntityID}`;

    return apiClient.delete(url, headers);
}