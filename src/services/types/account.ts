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
    account_band?: boolean
    account_name: string
    account_score?: number
    createdAt?: Date
    updatedAt?: Date
}

export interface AccountAll {
    count: number
    accounts: Account[]
}