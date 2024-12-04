import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { History, HistoryAll } from "~/services/types/history"

const url = (path: string = '') => `/history/${path}`

export interface HistoryParams {
    recharge?: string
    account?: string
    page?: number
    limit?: number
}

class HistoryService extends EduAPI {
    public async create(data: History): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getAll({ account, page, limit = 6, recharge }: HistoryParams): Promise<APIType<HistoryAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)
        if (page && !isNaN(+page)) {
            params += `&page=${page}&limit=${limit}`
        }

        if (account) params += `&account=${account}`
        if (recharge) params += `&recharge=${recharge}`

        return await this.getAPI(params)
    }

    public async getTotal(account?: string): Promise<APIType<number>> {
        let params = url('total')
        if (account) params += `?account=${account}`

        return await this.getAPI(params)
    }

    public async checkStatus(order: string): Promise<APIType<{ code: number }>> {
        return await this.getAPI(url(`check/${order}`))
    }
}

const HistoryAPI = new HistoryService()

export default HistoryAPI