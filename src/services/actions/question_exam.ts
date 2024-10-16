import EduAPI from "~/services/actions";
import { APIType } from "~/services/types/dataType";
import { QuestionExam, QuestionExamInfoAll } from "~/services/types/question_exam";

const url = (path: string = '') => `/question-exam/${path}`

export interface QuestionExamParams {
    page?: number
    exam?: string
    limit?: number
    title?: string
    question?: string
}

class QuestionExamService extends EduAPI {
    public async create(data: QuestionExam): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async update(data: QuestionExam): Promise<APIType<undefined>> {
        return await this.putAPI(
            url(`update?exam=${data.exam_Id}&question=${data.question_Id}`),
            data
        )
    }

    public async getAll({ page = 1, exam, limit = 6, title, question }: QuestionExamParams): Promise<APIType<QuestionExamInfoAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)

        if (exam) {
            params += `&exam=${exam}`
        }

        if (title) {
            params += `&title=${title}`
        }

        if (question) {
            params += `&question=${question}`
        }

        return await this.getAPI(params)
    }

    public async delete(data: QuestionExam): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`delete?exam=${data.exam_Id}&question=${data.question_Id}`))
    }
}

const QuestionExamAPI = new QuestionExamService()

export default QuestionExamAPI