import EduAPI from "~/services/actions";
import { Account, AccountAll, AccountLogin, AccountRegister } from "~/services/types/account";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/account/${path}`

export interface AccountParams {
    page?: number
    role?: boolean
    limit?: number
    active?: boolean
}

interface AccountUpdate {
    account_Id: string
    account_admin?: boolean
    account_band?: boolean
}

interface AccountScore {
    account_Id?: string
    account_email?: string
    account_score: number
}

interface EmailCode {
    email: string
    isForgot?: boolean
}

class AccountService extends EduAPI {
    public async register(data: AccountRegister): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getCode(email: string, isForgot?: boolean): Promise<APIType<undefined>> {
        const data: EmailCode = { email }
        if (typeof isForgot !== undefined) {
            data.isForgot = true
        }
        return await this.postAPI(url('code'), data)
    }

    public async login(data: { password: string, email: string, captcha: string }): Promise<APIType<AccountLogin>> {
        return await this.postAPI(url('login'), data)
    }

    public async updateToken(): Promise<APIType<AccountLogin>> {
        return await this.getAPI(url('token'))
    }

    public async changePassword(password: string, code: string): Promise<APIType<undefined>> {
        return await this.putAPI(url('password'), { password, code })
    }

    public async forgotPassword(data: { password: string, code: string, email: string }): Promise<APIType<undefined>> {
        return await this.putAPI(url('forgot'), data)
    }

    public async logOut(): Promise<APIType<undefined>> {
        return await this.deleteAPI(url('logout'))
    }

    public async getCaptCha(): Promise<APIType<{ url: string }>> {
        return await this.getAPI(url('captcha'))
    }

    public async getOne(): Promise<APIType<Account>> {
        return await this.getAPI(url('info'))
    }

    public async getOneByEmail(email: string): Promise<APIType<Account>> {
        return await this.postAPI(url('email'), { email })
    }

    public async getAll({ page, role, limit = 6, active }: AccountParams): Promise<APIType<AccountAll>> {
        let params = url('all?')
        if (page) {
            params += `page=${page}&limit=${limit}`
        }

        if (typeof role !== 'undefined') {
            params += `&role=${role}`
        }

        if (typeof active !== 'undefined') {
            params += `&active=${active}`
        }

        return await this.getAPI(params)
    }

    public async update(data: AccountUpdate): Promise<APIType<undefined>> {
        return await this.putAPI(url('update'), data)
    }

    public async changeName(account_name: string): Promise<APIType<undefined>> {
        return await this.putAPI(url('change-name'), { account_name })
    }

    public async changeScore(data: AccountScore): Promise<APIType<undefined>> {
        return await this.putAPI(url('change-score'), data)
    }
}

const AccountAPI = new AccountService()

export default AccountAPI