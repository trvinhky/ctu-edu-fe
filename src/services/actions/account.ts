import EduAPI from "~/services/actions";
import { AccountAll, AccountInfo, AccountLogin, AccountRegister } from "~/services/types/account";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/account/${path}`

class AccountService extends EduAPI {
    public async register(data: AccountRegister): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getCode(email: string): Promise<APIType<undefined>> {
        return await this.postAPI(url('code'), { email })
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

    public async getOne(): Promise<APIType<AccountInfo>> {
        return await this.getAPI(url('info'))
    }

    public async getOneByEmail(email: string): Promise<APIType<AccountInfo>> {
        return await this.postAPI(url('email'), { email })
    }

    public async getAll(page?: number, role?: boolean, limit: number = 6): Promise<APIType<AccountAll>> {
        let params = url('all')
        if (page) {
            params += `?page=${page}&limit=${limit}`

            if (typeof role !== 'undefined') {
                params += `&role=${role}`
            }
        }

        return await this.getAPI(params)
    }
}

const AccountAPI = new AccountService()

export default AccountAPI