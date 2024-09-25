import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Question, QuestionAll, QuestionInfo } from "~/services/types/question"

const url = (path: string = '') => `/question/${path}`

class QuestionService extends EduAPI {
    public async create(data: Question): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<QuestionInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Question): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.auth_Id}`), data)
    }

    public async getAll(page?: number, limit: number = 6): Promise<APIType<QuestionAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const QuestionAPI = new QuestionService()

export default QuestionAPI