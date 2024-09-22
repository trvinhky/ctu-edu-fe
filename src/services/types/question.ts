import { Account } from "~/services/types/account"
import { Option } from "~/services/types/option"
import { Resource } from "~/services/types/resource"
import { Type } from "~/services/types/type"

export interface Question {
    question_Id: string
    question_content: string
    type_Id: string
}

export interface QuestionInfo extends Question {
    type: Type
    resources?: Resource[]
    options?: Option[]
    auth?: Account
}