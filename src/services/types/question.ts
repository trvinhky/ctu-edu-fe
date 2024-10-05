import { Category } from "~/services/types/category"
import { Option } from "~/services/types/option"
import { Type } from "~/services/types/type"

export interface Question {
    question_Id?: string
    question_content: string
    type_Id: string
    auth_Id: string
    question_url?: string
    category_Id?: string
}

export interface QuestionInfo extends Question {
    type: Type
    category?: Category
    options?: Option[]
}

export interface QuestionAll {
    count: number
    questions: QuestionInfo[]
}