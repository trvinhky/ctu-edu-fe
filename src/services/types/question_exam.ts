import { Exam } from "~/services/types/exam"
import { Question } from "~/services/types/question"

export interface QuestionExam {
    exam_Id: string
    question_Id: string
    question_exam_score: number
}

export interface QuestionExamInfo extends QuestionExam {
    exams: Exam
    questions: Question
}