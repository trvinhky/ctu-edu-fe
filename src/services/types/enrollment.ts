import { AccountInfo } from "~/services/types/account"
import { Course } from "~/services/types/course"

export interface Enrollment {
    course_Id: string
    student_Id: string
    enrollment_date?: Date
}

export interface EnrollmentInfo extends Enrollment {
    course: Course
    student: AccountInfo
}