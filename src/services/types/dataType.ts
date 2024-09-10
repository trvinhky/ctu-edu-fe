import type { MenuProps } from 'antd';

export interface APIType<T> {
    message: String
    data?: T | Array<T>
}

export type MenuItem = Required<MenuProps>['items'][number];

export interface Item {
    key: string
    label: string
    href?: string
}

export interface NavBarItem extends Item {
    icon?: JSX.Element
    children?: Item[]
}


export interface Option {
    value: string;
    label: string;
}