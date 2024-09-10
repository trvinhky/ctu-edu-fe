import { AccountInfo } from "~/services/types/account"
import { Field } from "~/services/types/field"

export interface Course {
    course_Id: string
    course_name: string
    course_image?: string
    course_content: string
    course_total?: number
    course_required?: string
    teacher_Id: string
    field_Id: string
}

export interface CourseInfo extends Course {
    teacher: AccountInfo
    field: Field
}