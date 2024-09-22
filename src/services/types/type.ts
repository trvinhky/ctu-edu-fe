import { Question } from "~/services/types/question"

export interface Type {
    type_Id: string
    type_name: string
}

export interface TypeInfo extends Type {
    questions: Question[]
}