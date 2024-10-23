import EduAPI from "~/services/actions";
import { Answer, AnswerAll } from "~/services/types/answer";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/answer/${path}`

export interface AnswerProps {
    page?: number
    limit?: number
    student?: string
    question?: string
    option?: string
}

class AnswerService extends EduAPI {
    public async create(data: Answer): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async update(data: Answer): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.answer_Id}`), data)
    }

    public async getAll({ page = 1, option, student, limit = 6, question }: AnswerProps): Promise<APIType<AnswerAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)

        if (option) params += `&option=${option}`
        if (student) params += `&student=${student}`
        if (question) params += `&question=${question}`

        return await this.getAPI(params)
    }
}

const AnswerAPI = new AnswerService()

export default AnswerAPI