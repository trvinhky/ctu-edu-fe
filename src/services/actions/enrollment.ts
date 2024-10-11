import EduAPI from "~/services/actions";
import { APIType } from "~/services/types/dataType";
import { Enrollment, EnrollmentAll } from "~/services/types/enrollment";

const url = (path: string = '') => `/enrollment/${path}`

export interface EnrollmentProps {
    page?: number
    limit?: number
    student?: string
    course?: string
    title?: string
    subject?: string
}

class EnrollmentService extends EduAPI {
    public async register(data: Enrollment): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getAll({ page = 1, course, student, limit = 6, title, subject }: EnrollmentProps): Promise<APIType<EnrollmentAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)

        if (course) params += `&course=${course}`
        if (student) params += `&student=${student}`
        if (title) params += `&title=${title}`
        if (subject) params += `&subject=${subject}`

        return await this.getAPI(params)
    }

    public async delete(data: Enrollment): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`delete?course=${data.course_Id}&student=${data.student_Id}`))
    }
}

const EnrollmentAPI = new EnrollmentService()

export default EnrollmentAPI