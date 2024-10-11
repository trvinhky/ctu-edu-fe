import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { QuestionAll, QuestionInfo } from "~/services/types/question"

const url = (path: string = '') => `/question/${path}`

export interface QuestionParams {
    page?: number
    type?: string
    id?: string
    limit?: number
    title?: string
}

class QuestionService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<QuestionInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(id: string, data: FormData): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${id}`), data)
    }

    public async getAll({ page = 1, type, id, limit = 6, title }: QuestionParams): Promise<APIType<QuestionAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)
        if (type) {
            params += `&type=${type}`
        }

        if (id) {
            params += `&id=${id}`
        }

        if (title) {
            params += `&title=${title}`
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const QuestionAPI = new QuestionService()

export default QuestionAPI