import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const DATEFORMAT = 'DD/MM/YYYY';
export const DATEFORMAT_FULL = 'DD/MM/YYYY HH:mm'

export const ENV = {
    BE_HOST: import.meta.env.VITE_URL_BACKEND || 'http://localhost:5000'
}

export const convertUrl = (url: string, host: string = ENV.BE_HOST) => `${host}\\${url}`.replace(/\\/g, '/')

export const convertDate = (time: string, format: string = DATEFORMAT) => dayjs.utc(time as string).local().format(format as string)