import { AccountInfo } from "~/services/types/account"
import { CourseInfo } from "./course"

export interface Enrollment {
    course_Id: string
    student_Id: string
    enrollment_date?: Date
}

export interface EnrollmentInfo extends Enrollment {
    course: CourseInfo
    student: AccountInfo
}

export interface EnrollmentAll {
    count: number
    enrollments: EnrollmentInfo[]
}