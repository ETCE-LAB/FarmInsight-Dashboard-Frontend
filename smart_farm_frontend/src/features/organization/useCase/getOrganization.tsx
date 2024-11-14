import APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Measurement} from "../../measurements/models/measurement";
import {Organization} from "../models/Organization";


export const getOrganization = (identifier:string) => {
    const apiClient = new APIClient()

    const user = getUser();
    const token = user?.access_token;

    const headers =
        {'Authorization': `Bearer ${token}`}

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/organizations/${identifier}`;
    const result:  Promise<Organization> = apiClient.get(url, headers)

    return result
}