import { UserProfile } from "../../userProfile/models/UserProfile";

export interface Membership{
    id:string
    membershipRole:string
    userprofile:UserProfile
}

export const enum MembershipRole {
    ADMIN = 'admin',
    MEMBER = 'member'
}