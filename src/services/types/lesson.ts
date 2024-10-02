import { Resource } from "~/services/types/resource"

export interface Lesson {
    lesson_Id?: string
    lesson_title: string
    lesson_content?: string
    course_Id: string
}

export interface LessonInfo extends Lesson {
    resources: Resource[]
}

export interface LessonAll {
    count: number
    lessons: LessonInfo[]
}