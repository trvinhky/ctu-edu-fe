import { Type } from "~/services/types/type"

export interface QuestionResource {
    question_resource_Id: string
    question_resource_url: string
    resource_type: string
    question_Id: string
}

export interface QuestionResourceInfo extends QuestionResource {
    type: Type
}