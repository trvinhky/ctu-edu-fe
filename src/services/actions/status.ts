import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Status, StatusAll, StatusInfo } from "~/services/types/status"

const url = (path: string = '') => `/status/${path}`

class StatusService extends EduAPI {
    public async create(data: Status): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<StatusInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(page?: number, limit: number = 6): Promise<APIType<StatusAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }
}

const StatusAPI = new StatusService()

export default StatusAPI