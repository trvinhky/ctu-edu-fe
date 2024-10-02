import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { ResourceAll, ResourceInfo } from "~/services/types/resource"

const url = (path: string = '') => `/resource/${path}`

class ResourceService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<ResourceInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(page?: number, lesson?: string, limit: number = 6): Promise<APIType<ResourceAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`

            if (lesson) {
                params += `&lesson=${lesson}`
            }
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(id))
    }
}

const ResourceAPI = new ResourceService()

export default ResourceAPI