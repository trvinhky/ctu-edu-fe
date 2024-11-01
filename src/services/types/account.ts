import { Profile } from "~/services/types/profile"

export interface AccountLogin {
    token: string
}

export interface AccountRegister {
    email: string
    password: string
    name: string,
    isAdmin?: boolean
    code: string
}

export interface Account {
    account_Id: string
    account_email: string
    account_password?: string
    account_token?: string
    account_admin?: boolean
    createdAt: string
    updatedAt: string
}

export interface AccountInfo extends Account {
    profile: Profile
}

export interface AccountAll {
    count: number
    accounts: AccountInfo[]
}