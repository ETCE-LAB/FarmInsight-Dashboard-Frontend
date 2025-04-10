


export interface WeatherForcast {
    fetchDate: Date,
    forecastDate:Date,
    rainMM:number
    sunshineDurationSeconds:number
    weatherCode:string
    windSpeedMax:number
    temperatureMinC:number
    temperatureMaxC:number
    sunrise:Date
    sunset:Date
    precipitationMM:number
    precipitationProbability:number
    locationId:string
}