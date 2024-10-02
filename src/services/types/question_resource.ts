import { Category } from "~/services/types/category"

export interface QuestionResource {
    question_resource_Id?: string
    question_resource_url: string
    category_Id: string
    question_Id: string
}

export interface QuestionResourceInfo extends QuestionResource {
    category: Category
}

export interface QuestionResourceAll {
    count: number
    questionResources: QuestionResourceInfo[]
}