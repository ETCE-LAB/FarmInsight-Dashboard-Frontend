import {BACKEND_URL} from "../env-config";


export const getIsoStringFromDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

export const getSensorStateColor = (measuredAt: Date, isActive: boolean, intervalSeconds: number): string => {
    const measured_ms = measuredAt.getTime();
    const now_ms = new Date().getTime();
    const difference_seconds = (now_ms - measured_ms) / 1000;

    if (!isActive) {
        return 'grey';
    }

    if (difference_seconds < intervalSeconds) {
        return 'green';
    }
    if (difference_seconds < intervalSeconds * 2) {
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

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getBackendTranslation(value: string, languageCode: string) {
    const split = value.split(';');
    if (languageCode === 'de' && split.length > 1) {
        return split[1];
    }
    // default return EN
    return split[0];
}

export function getWsUrl() {
    let baseUrl = BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured.");
    if (baseUrl.startsWith("https")) {
        baseUrl = baseUrl.replace("https", "wss");
    } else if (baseUrl.startsWith("http")) {
        baseUrl = baseUrl.replace("http", "ws");
    } else {
        throw new Error(`Invalid BACKEND_URL: ${baseUrl}`);
    }

    return baseUrl;
}