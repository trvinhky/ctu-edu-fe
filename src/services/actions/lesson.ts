import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { LessonAll, LessonInfo } from "~/services/types/lesson"

const url = (path: string = '') => `/lesson/${path}`

interface LessonParams {
    id: string
    score?: number
    page?: number
    limit?: number
}

class LessonService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data, true)
    }

    public async getOne(id: string): Promise<APIType<LessonInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(id: string, data: FormData): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${id}`), data, true)
    }

    public async getAll({ id, page, limit = 6, score }: LessonParams): Promise<APIType<LessonAll>> {
        let params = url(`all?id=${id}`)
        if (page && !isNaN(+page)) {
            params += `&page=${page}&limit=${limit}`
        }

        if (score) params += `&score=${score}`

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const LessonAPI = new LessonService()

export default LessonAPI