

export interface UserProfile{
    id:string,
    name:string,
    email:string
    systemRole:string
}

export enum SystemRole {
    ADMIN = 'admin',
    USER = 'user',
}