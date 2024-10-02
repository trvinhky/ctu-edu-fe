import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Lesson, LessonAll, LessonInfo } from "~/services/types/lesson"

const url = (path: string = '') => `/lesson/${path}`

class LessonService extends EduAPI {
    public async create(data: Lesson): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<LessonInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Lesson): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.lesson_Id}`), data)
    }

    public async getAll(id: string, page?: number, limit: number = 6): Promise<APIType<LessonAll>> {
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

const LessonAPI = new LessonService()

export default LessonAPI