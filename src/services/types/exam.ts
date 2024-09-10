import { Course } from "~/services/types/course"

export interface Exam {
    exam_Id: string
    exam_title: string
    exam_description?: string
    exam_total_score: number
    exam_start_time?: Date
    exam_limit: number
    course_Id: string
}

export interface ExamInfo extends Exam {
    course: Course
}