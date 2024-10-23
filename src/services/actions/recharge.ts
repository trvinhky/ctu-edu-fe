import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Payment, Recharge, RechargeAll } from "~/services/types/recharge"

const url = (path: string = '') => `/recharge/${path}`

class RechargeService extends EduAPI {
    public async create(data: Recharge): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<Recharge>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Recharge): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.recharge_Id}`), data)
    }

    public async getAll(page?: number, limit?: number): Promise<APIType<RechargeAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }

    public async payment(amount: number): Promise<APIType<Payment>> {
        return await this.postAPI(url('payment'), { amount })
    }
}

const RechargeAPI = new RechargeService()

export default RechargeAPI