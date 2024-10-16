import { AccountInfo } from "~/services/types/account"
import { Exam } from "~/services/types/exam"

export interface Result {
    student_Id: string
    exam_Id: string
    result_completed?: Date
}

export interface ResultInfo extends Result {
    exams: Exam
    students: AccountInfo[]
}