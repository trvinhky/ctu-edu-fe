import { AccountInfo } from "~/services/types/account"
import { Subject } from "~/services/types/subject"

export interface Course {
    course_Id: string
    course_name: string
    course_image?: string
    course_content: string
    teacher_Id: string
    subject_Id: string
}

export interface CourseInfo extends Course {
    teacher: AccountInfo
    subject: Subject
}