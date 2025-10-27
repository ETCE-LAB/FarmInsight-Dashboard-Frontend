import {BACKEND_URL} from "../env-config";
import i18n from "i18next";

export const moveArrayItem = (inputArray: any[], sourceIdx:number, destIdx:number): any[] => {
    let array = structuredClone(inputArray);
    if (sourceIdx === destIdx) return array;

    const temp = array[sourceIdx];

    // remove moved item from its original position
    array.splice(sourceIdx, 1);

    // place item in new position
    array.splice(destIdx, 0, temp);

    return array;
}

export const formatFloatValue = (value: number | undefined | null): string => {
    if (value === undefined || value === null)
        return '';

    return value % 1 === 0 ? value.toString() : value.toFixed(2);
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
    const slack = 120; // to avoid sensors instantly turning yellow when the task is still working

    if (!isActive) return 'grey';
    if (difference_seconds < (intervalSeconds + slack)) return 'green';
    if (difference_seconds < (intervalSeconds + slack) * 2) return 'yellow';

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

export function getBackendTranslation(value: string | undefined, languageCode: string) {
    if (!value) return ''

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

export function truncateText(text: string, limit: number) {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
}