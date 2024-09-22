import { Account } from "~/services/types/account"

export interface Role {
    role_Id?: string
    role_name: string
}

export interface RoleInfo extends Role {
    accounts?: Account[]
}

export interface RoleAll {
    count: number
    roles: RoleInfo[]
}


