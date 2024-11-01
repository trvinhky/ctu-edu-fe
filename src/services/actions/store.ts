import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { StoreAll, StoreInfo } from "~/services/types/store"

const url = (path: string = '') => `/store/${path}`

class StoreService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data, true)
    }

    public async update(id: string, data: FormData): Promise<APIType<undefined>> {
        return await this.putAPI(url(id), data, true)
    }

    public async getOne(id: string): Promise<APIType<StoreInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(page?: number, limit: number = 6, title?: string): Promise<APIType<StoreAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
            if (title) {
                params += `&title=${title}`
            }
        }

        return await this.getAPI(params)
    }
}

const StoreAPI = new StoreService()

export default StoreAPI