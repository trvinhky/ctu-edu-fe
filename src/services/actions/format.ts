import EduAPI from "~/services/actions"
import { Format, FormatAll, FormatInfo } from "~/services/types/format.ts"
import { APIType } from "~/services/types/dataType"

const url = (path: string = '') => `/format/${path}`

class FormatService extends EduAPI {
    public async create(data: Format): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<FormatInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Format): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.format_Id}`), data)
    }

    public async getAll(page?: number, limit: number = 6): Promise<APIType<FormatAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }
}

const FormatAPI = new FormatService()

export default FormatAPI