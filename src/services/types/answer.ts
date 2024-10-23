import { AccountInfo } from "~/services/types/account"
import { Option } from "~/services/types/option"
import { Question } from "~/services/types/question"

export interface Answer {
    answer_Id?: string
    option_Id: string
    student_Id: string
    question_Id: string
}

export interface AnswerInfo extends Answer {
    question: Question
    student: AccountInfo
    option: Option
}

export interface AnswerAll {
    count: number
    students: AnswerInfo[]
}