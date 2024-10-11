import EduAPI from "~/services/actions";
import { CourseAll, CourseInfo } from "~/services/types/course";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/course/${path}`

export interface CourseParams {
    page?: number
    title?: string
    subject?: string
    limit?: number
    teacher?: string
    id?: string
}

class CourseService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data, true)
    }

    public async update(id: string, data: FormData): Promise<APIType<undefined>> {
        return await this.putAPI(url(id), data, true)
    }

    public async getOne(id: string): Promise<APIType<CourseInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll({ page = 1, title, subject, teacher, limit = 6, id }: CourseParams): Promise<APIType<CourseAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)

        if (title) params += `&title=${title}`
        if (subject) params += `&subject=${subject}`
        if (teacher) params += `&teacher=${teacher}`
        if (id) params += `&id=${id}`

        return await this.getAPI(params)
    }
}

const CourseAPI = new CourseService()

export default CourseAPI