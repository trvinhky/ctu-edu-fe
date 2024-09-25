import { MenuProps } from "antd";

export interface APIType<T> {
    message: String
    data: T | Array<T>
    status: number
}

export type MenuItem = Required<MenuProps>['items'][number]

export interface Option {
    value: string;
    label: string;
}

export interface Error {
    status: number;
    data: { message: string }
}