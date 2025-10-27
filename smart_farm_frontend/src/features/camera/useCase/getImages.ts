import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {BACKEND_URL} from "../../../env-config";


export const getImages = (cameraId:string, from?:string) => {
    if (!from) {
        const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - 10);

        // Formatierung des Datums im Format YYYY-MM-DD
        const year = pastDate.getFullYear();
        const month = String(pastDate.getMonth() + 1).padStart(2, '0');
        const day = String(pastDate.getDate()).padStart(2, '0');

        from = `${year}-${month}-${day}`;
    }

    const apiClient = new APIClient();

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`};

    let url = `${BACKEND_URL}/api/cameras/${cameraId}/images?from=${from}`;

    const result: Promise<[{url:string, measuredAt:string, camera:string}]> = apiClient.get(url, headers);
    return result
}