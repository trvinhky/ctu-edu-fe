import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Subject, SubjectInfo } from "~/services/types/subject"

const url = (path: string = '') => `/subject/${path}`

class SubjectService extends EduAPI {
    public async create(data: Subject): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async update(data: Subject): Promise<APIType<undefined>> {
        return await this.putAPI(url(data.subject_Id as string), data)
    }

    public async getOne(id: string): Promise<APIType<SubjectInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(page?: number, limit: number = 6): Promise<APIType<Subject>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }
}

const SubjectAPI = new SubjectService()

export default SubjectAPI