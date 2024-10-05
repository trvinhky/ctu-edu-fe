import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Exam, ExamAll, ExamInfo } from "~/services/types/exam"

const url = (path: string = '') => `/exam/${path}`

class ExamService extends EduAPI {
    public async create(data: Exam): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<ExamInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Exam): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.exam_Id}`), data)
    }

    public async getAll(page?: number, course?: string, limit: number = 6): Promise<APIType<ExamAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
            if (course) {
                params += `&course=${course}`
            }
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const ExamAPI = new ExamService()

export default ExamAPI