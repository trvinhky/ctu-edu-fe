import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Option, OptionAll, OptionInfo } from "~/services/types/option"

const url = (path: string = '') => `/option/${path}`

class OptionService extends EduAPI {
    public async create(data: Option): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<OptionInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Option): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.option_Id}`), data)
    }

    public async getAll(id: string, page?: number, limit: number = 6): Promise<APIType<OptionAll>> {
        let params = url(`all?id=${id}`)
        if (page && !isNaN(+page)) {
            params += `&page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const OptionAPI = new OptionService()

export default OptionAPI