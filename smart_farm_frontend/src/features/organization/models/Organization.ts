import {Fpf} from "../../fpf/models/Fpf";
import {Membership} from "../../membership/models/membership"
import {Location} from "../../location/models/location";

export interface Organization{
    id:string
    name:string
    isPublic:boolean
    FPFs:Fpf[]
    memberships:Membership[]
    locations: Location[]
}

export interface OrganizationMembership {
    id: string,
    name: string
    membership: {
        id: string
        role: string
    }
}