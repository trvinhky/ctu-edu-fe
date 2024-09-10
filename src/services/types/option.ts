import { Question } from "~/services/types/question"

export interface Option {
    option_Id: string
    option_content: string
    option_is_correct: boolean
    question_Id: string
}

export interface OptionInfo extends Option {
    question: Question
}