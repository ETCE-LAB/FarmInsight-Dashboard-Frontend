import  APIClient from "../../../utils/APIClient";
import {getUser} from "../../../utils/getUser";
import {Sensor} from "../models/Sensor";
import {HardwareConfiguration} from "../../hardwareConfiguration/models/HardwareConfiguration";

export const addSensor = async (data: { name:string, location:string, unit:string, modelNr:string, isActive:boolean, intervalSeconds:number, hardwareConfig:HardwareConfiguration, fpfID:string }) => {
    try {
        //const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/organizations`, {
        const apiClient = new APIClient()
        const user = getUser();
        const token = user?.access_token;
        const headers =
            {'Authorization': `Bearer ${token}`}
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/sensors`;
        const response:Sensor = await apiClient.post(url, data, headers);

        return response;
    }
    catch (error) {
        console.error("Error: " + error);
    }
};