import {Sensor} from "../../sensor/models/Sensor";
import {Camera} from "../../camera/models/camera";
import {GrowingCycle} from "../../growthCycle/models/growingCycle";
import {Location} from "../../location/models/location";

export interface Fpf {
    id:string,
    name:string
    isPublic:boolean,
    sensorServiceIp:string,
    Sensors: Sensor[],
    Cameras: Camera[]
    GrowingCycles: GrowingCycle[]
    Location: Location
}