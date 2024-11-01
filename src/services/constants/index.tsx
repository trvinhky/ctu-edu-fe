import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { RcFile } from "antd/es/upload";

dayjs.extend(utc);
dayjs.extend(timezone);

export const DATEFORMAT = 'DD/MM/YYYY';
export const DATEFORMAT_FULL = 'DD/MM/YYYY HH:mm'

export const ENV = {
    BE_HOST: import.meta.env.VITE_URL_BACKEND
}

export const convertUrl = (url: string, host: string = ENV.BE_HOST) => `${host}\\${url}`.replace(/\\/g, '/')

export const convertDate = (time: string, format: string = DATEFORMAT) => dayjs.utc(time as string).local().format(format as string)

export const convertFileToRcFile = (file: File): RcFile => {
    const rcFile: RcFile = {
        ...file,
        uid: '-1',
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified),
        name: file.name,
        size: file.size,
        type: file.type,
    };

    return rcFile;
};

export const getFileFromUrl = async (url: string, fileName: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const file = new File([data], fileName, { type: data.type });
    return convertFileToRcFile(file)
};

export const getFileNameFromUrl = (url: string) => {
    // Sử dụng split("/") để tách các phần của URL và lấy phần cuối cùng
    return url.split('/').pop() || 'default_filename';
};

export const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

export const ROLE_OPTIONS = [
    {
        label: 'admin',
        value: true
    },
    {
        label: 'người dùng',
        value: false
    }
]