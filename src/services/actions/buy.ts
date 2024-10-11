import EduAPI from "~/services/actions";
import { Buy, BuyAll, BuyInfo } from "~/services/types/buy";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/buy/${path}`

export interface BuyProps {
    page?: number
    limit?: number
    student?: string
    lesson?: string
    title?: string
    score?: number
}

class BuyService extends EduAPI {
    public async create(data: Buy): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(data: Buy): Promise<APIType<BuyInfo>> {
        return await this.getAPI(url(`info?lesson=${data.lesson_Id}&student=${data.student_Id}`))
    }

    public async getAll({ page = 1, lesson, student, limit = 6, title, score }: BuyProps): Promise<APIType<BuyAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)

        if (lesson) params += `&lesson=${lesson}`
        if (student) params += `&student=${student}`
        if (score) params += `&score=${score}`
        if (title) params += `&title=${title}`

        return await this.getAPI(params)
    }
}

const BuyAPI = new BuyService()

export default BuyAPI