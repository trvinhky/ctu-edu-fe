import { Course } from "~/services/types/course"

export interface Exam {
    exam_Id?: string
    exam_title: string
    exam_description?: string
    exam_limit: number
    course_Id: string
}

export interface ExamInfo extends Exam {
    course: Course
}

export interface ExamAll {
    count: number
    exams: ExamInfo[]
}