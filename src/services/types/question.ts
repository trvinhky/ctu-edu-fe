import { Category } from "~/services/types/category"
import { Option } from "~/services/types/option"

export interface Question {
    question_Id?: string
    question_content: string
    auth_Id: string
    question_url?: string
    category_Id?: string
}

export interface QuestionInfo extends Question {
    category?: Category
    options?: Option[]
}

export interface QuestionAll {
    count: number
    questions: QuestionInfo[]
}