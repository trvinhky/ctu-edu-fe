import { Category } from "~/services/types/category"


export interface Lesson {
    lesson_Id?: string
    lesson_title: string
    lesson_content?: string
    course_Id: string
    lesson_url: string
    lesson_score: number
    category_Id: string
}

export interface LessonInfo extends Lesson {
    category: Category[]
}

export interface LessonAll {
    count: number
    lessons: LessonInfo[]
}