import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { QuestionResourceAll } from "~/services/types/question_resource"

const url = (path: string = '') => `/question-resource/${path}`

class QuestionResourceService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getAll(page?: number, question?: string, limit: number = 6): Promise<APIType<QuestionResourceAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`

            if (question) {
                params += `&question=${question}`
            }
        }

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(id))
    }
}

const QuestionResourceAPI = new QuestionResourceService()

export default QuestionResourceAPI