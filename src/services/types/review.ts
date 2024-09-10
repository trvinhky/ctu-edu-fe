import { AccountInfo } from "~/services/types/account"
import { Course } from "~/services/types/course"

export interface Review {
    review_Id: string
    review_rating: number
    review_comment: string
    createdAt: Date
    updatedAt: Date
    course_Id: string
    student_Id: string
}

export interface ReviewInfo extends Review {
    course: Course
    student: AccountInfo
}