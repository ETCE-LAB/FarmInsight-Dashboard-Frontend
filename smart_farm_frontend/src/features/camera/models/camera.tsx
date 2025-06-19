


export interface Camera{
    id:string,
    name:string,
    location:string,
    modelNr:string,
    resolution:string,
    isActive:boolean,
    intervalSeconds:number,
    snapshotUrl:string,
    livestreamUrl:string,
    lastImageAt: string,
    images: [
        measuredAt: Date,
        url:string
    ] | any
}

export interface EditCamera {
    fpfId:string
    id: string,
    name: string,
    location: string,
    modelNr: string,
    resolution: string,
    isActive: boolean,
    intervalSeconds: number,
    snapshotUrl: string,
    livestreamUrl: string,
}
