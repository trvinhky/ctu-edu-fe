import { Account } from "~/services/types/account"
import { Recharge } from "~/services/types/recharge"

export interface History {
    history_Id?: string
    history_createdAt?: Date
    recharge_Id: string
    account_Id: string
}

export interface HistoryInfo extends History {
    recharge: Recharge
    account: Account
}

export interface HistoryAll {
    count: number
    histories: HistoryInfo[]
}