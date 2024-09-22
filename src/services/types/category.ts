import { QuestionResource } from "~/services/types/question_resource"
import { Resource } from "~/services/types/resource"

export interface Category {
    category_Id: string
    category_name: string
}

export interface CategoryInfo extends Category {
    resources: Resource[]
    questions: QuestionResource[]
}