import { Account } from "~/services/types/account"
import { Category } from "~/services/types/category"
import { Option } from "~/services/types/option"
import { Resource } from "~/services/types/resource"

export interface Question {
    question_Id: string
    question_content: string
    category_Id: string
}

export interface QuestionInfo extends Question {
    category: Category
    resources?: Resource[]
    options?: Option[]
    auth: Account
}