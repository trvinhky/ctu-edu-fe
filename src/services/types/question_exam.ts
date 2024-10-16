import { Exam } from "~/services/types/exam"
import { QuestionInfo } from "~/services/types/question"

export interface QuestionExam {
    exam_Id: string
    question_Id: string
}

export interface QuestionExamInfo extends QuestionExam {
    exam: Exam
    question: QuestionInfo
}

export interface QuestionExamInfoAll {
    count: number
    questionExams: QuestionExamInfo[]
}