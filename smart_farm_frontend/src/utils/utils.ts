import {BACKEND_URL} from "../env-config";
import i18n from "i18next";


export const formatFloatValue = (value: number): string => {
    if (value)
        return value % 1 === 0 ? value.toString() : value.toFixed(2);

    return '';
}

export const getIsoStringFromDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const second = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

export const getSensorStateColor = (measuredAt: Date, isActive: boolean, intervalSeconds: number): string => {
    const measured_ms = measuredAt.getTime();
    const now_ms = new Date().getTime();
    const difference_seconds = (now_ms - measured_ms) / 1000;

    if (!isActive) return 'grey';
    if (difference_seconds < intervalSeconds) return 'green';
    if (difference_seconds < intervalSeconds * 2) return 'yellow';

    return 'red';
}

export const getSensorStateColorHint = (color: string)=> {
    if (color === 'green')  return i18n.t("overview.green");
    if (color === 'yellow') return i18n.t('overview.yellow');
    if (color === 'red')    return i18n.t('overview.red');
    if (color === 'grey')   return i18n.t('overview.grey');

    return i18n.t('overview.other');
}

export const getColorFromLogLevel = (logLevel: string): string => {
    if (logLevel === 'DEBUG')   return 'blue';
    if (logLevel === 'INFO')    return 'green';
    if (logLevel === 'WARNING') return 'yellow';
    if (logLevel === 'ERROR')   return 'red';

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