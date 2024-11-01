import { Account } from "~/services/types/account"
import { DocumentInfo } from "~/services/types/document"

export interface Buy {
    document_Id: string
    account_Id: string
    buy_date?: Date
}

export interface BuyInfo extends Buy {
    account: Account
    document: DocumentInfo
}

export interface BuyAll {
    count: number
    buy: BuyInfo[]
}