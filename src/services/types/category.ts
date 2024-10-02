import { QuestionResource } from "~/services/types/question_resource"
import { Resource } from "~/services/types/resource"

export interface Category {
    category_Id?: string
    category_name: string
    category_accept: string
    category_description: string
}

export interface CategoryInfo extends Category {
    resources: Resource[]
    questions: QuestionResource[]
}

export interface CategoryAll {
    count: number
    categories: CategoryInfo[]
}