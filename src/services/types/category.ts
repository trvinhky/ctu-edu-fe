import { Lesson } from "~/services/types/lesson"
import { Question } from "~/services/types/question"

export interface Category {
    category_Id?: string
    category_name: string
    category_accept: string
    category_description: string
}

export interface CategoryInfo extends Category {
    lessons: Lesson[]
    questions: Question[]
}

export interface CategoryAll {
    count: number
    categories: CategoryInfo[]
}