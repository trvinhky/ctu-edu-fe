import EduAPI from "~/services/actions";
import { CourseAll, CourseInfo } from "~/services/types/course";
import { APIType } from "~/services/types/dataType";

const url = (path: string = '') => `/course/${path}`

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

    public async getAll(page?: number, title?: string, subject?: string, limit: number = 6): Promise<APIType<CourseAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        } else {
            params += `?page=1&limit=${limit}`
        }

        if (title) params += `&title=${title}`
        if (subject) params += `&subject=${subject}`

        return await this.getAPI(params)
    }
}

const CourseAPI = new CourseService()

export default CourseAPI