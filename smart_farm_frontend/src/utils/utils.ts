import {Sensor} from "../features/sensor/models/Sensor";


export const getIsoStringFromDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

export const getSensorStateColor = (sensor: Sensor): string => {
    const measured_ms = new Date(sensor.lastMeasurement.measuredAt).getTime();
    const now_ms = new Date().getTime();
    const difference_seconds = (now_ms - measured_ms) / 1000;

    if (difference_seconds < sensor.intervalSeconds) {
        return 'green';
    }
    if (difference_seconds < sensor.intervalSeconds * 2) {
        return 'yellow';
    }

    return 'red';
}

export const getColorFromLogLevel = (logLevel: string): string => {
    if (logLevel === 'DEBUG') return 'blue';
    if (logLevel === 'INFO') return 'green';
    if (logLevel === 'WARNING') return 'yellow';
    if (logLevel === 'ERROR') return 'red';

    return 'white';
}
