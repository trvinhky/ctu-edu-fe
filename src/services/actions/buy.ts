import EduAPI from "~/services/actions";
import { Buy, BuyAll, BuyInfo } from "~/services/types/buy";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/buy/${path}`

export interface BuyProps {
    page?: number
    limit?: number
    account?: string
    document?: string
    title?: string
    score?: number
}

class BuyService extends EduAPI {
    public async create(data: Buy): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(data: Buy): Promise<APIType<BuyInfo>> {
        return await this.getAPI(url(`info?document=${data.document_Id}&account=${data.account_Id}`))
    }

    public async getAll(data: BuyProps): Promise<APIType<BuyAll>> {
        const { page, document, account, limit, title, score } = data
        let params = url(`all?`)
        if (page && limit) {
            params += `page=${page}&limit=${limit}`
        }

        if (document) params += `&document=${document}`
        if (account) params += `&account=${account}`
        if (score) params += `&score=${score}`
        if (title) params += `&title=${title}`

        return await this.getAPI(params)
    }
}

const BuyAPI = new BuyService()

export default BuyAPI