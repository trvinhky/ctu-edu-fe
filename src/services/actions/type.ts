import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Type, TypeAll, TypeInfo } from "~/services/types/type"

const url = (path: string = '') => `/type/${path}`

class TypeService extends EduAPI {
    public async create(data: Type): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<TypeInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(page?: number, limit: number = 6): Promise<APIType<TypeAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }
}

const TypeAPI = new TypeService()

export default TypeAPI