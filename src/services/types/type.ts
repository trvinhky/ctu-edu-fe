import { Question } from "~/services/types/question"
import { Resource } from "~/services/types/resource"

export interface Type {
    type_Id: string
    type_name: string
}

export interface TypeInfo extends Type {
    resources: Resource[]
    questions: Question[]
}