import { Account } from "~/services/types/account"
import { Resource } from "~/services/types/resource"

export interface Buy {
    resource_Id: string
    student_Id: string
    buy_date: Date
}

export interface BuyInfo extends Buy {
    student: Account
    resource: Resource
}