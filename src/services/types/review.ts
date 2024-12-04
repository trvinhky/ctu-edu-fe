import { Account } from "~/services/types/account"
import { DocumentInfo } from "~/services/types/document"

export interface Review {
    review_Id?: string
    review_ratings: number
    review_content: string
    document_Id: string
    account_Id?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface ReviewInfo extends Review {
    account: Account
    document: DocumentInfo
}

export interface ReviewAll {
    count: number
    reviews: ReviewInfo[]
}