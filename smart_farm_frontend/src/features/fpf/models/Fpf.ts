import {Sensor} from "../../sensor/models/Sensor";
import {Camera} from "../../camera/models/camera";
import {GrowingCycle} from "../../growthCycle/models/growingCycle";
import {Location} from "../../location/models/location";
import {ControllableAction} from "../../controllables/models/controllableAction";
import {Hardware} from "../../hardware/models/hardware";
import {Model} from "../../model/models/Model";

export interface Fpf {
    id:string,
    name:string
    isPublic:boolean,
    sensorServiceIp:string,
    Sensors: Sensor[],
    Models: Model[],
    Cameras: Camera[]
    GrowingCycles: GrowingCycle[]
    ControllableAction: ControllableAction[]
    Location: Location
    Hardware: Hardware[]
    isActive: boolean
}