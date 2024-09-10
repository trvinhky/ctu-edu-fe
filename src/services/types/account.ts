import { Profile } from "~/services/types/profile"
import { Role } from "~/services/types/role"

export interface AccountLogin {
    token: string
}

export interface Account {
    account_Id: string
    account_email: string
    account_password?: string
    account_active: boolean
    account_token?: string
    role_Id?: string
    createdAt: string
    updatedAt: string
}

export interface AccountInfo extends Account {
    role?: Role
    profile: Profile
}