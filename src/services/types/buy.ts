import { Account } from "~/services/types/account"
import { LessonInfo } from "~/services/types/lesson"

export interface Buy {
    lesson_Id: string
    student_Id: string
    buy_date?: Date
}

export interface BuyInfo extends Buy {
    student: Account
    lesson: LessonInfo
}

export interface BuyAll {
    count: number
    buy: BuyInfo[]
}