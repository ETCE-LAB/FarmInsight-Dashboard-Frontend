import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const getLivestream = async (cameraId: string, from:string="2024-10-10") => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}
    let url = `${BACKEND_URL}/api/cameras/${cameraId}/livestream`;

//cameras/${amera_id}/livestream


    return apiClient.get(url, headers)
};