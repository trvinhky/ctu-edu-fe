import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Question, QuestionAll, QuestionInfo } from "~/services/types/question"

const url = (path: string = '') => `/question/${path}`

export interface QuestionParams {
    page?: number
    type?: string
    id?: string
    limit?: number
}

class QuestionService extends EduAPI {
    public async create(data: Question): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<QuestionInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Question): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.question_Id}`), data)
    }

    public async getAll({ page = 1, type, id, limit = 6 }: QuestionParams): Promise<APIType<QuestionAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)
        if (type) {
            params += `&type=${type}`
        }

        if (id) {
            params += `&id=${id}`
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const QuestionAPI = new QuestionService()

export default QuestionAPI