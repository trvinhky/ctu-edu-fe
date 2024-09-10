import { Question } from "~/services/types/question"

export interface Category {
    category_Id: string
    category_name: string
}

export interface CategoryInfo extends Category {
    questions: Question[]
}