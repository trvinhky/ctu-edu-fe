import { AccountInfo } from "~/services/types/account"

export interface Discussion {
    discussion_Id: string
    discussion_comment: string
    createdAt: Date
    updatedAt: Date
    lesson_Id: string
    account_Id: string
    parent_Id?: string
}

export interface DiscussionInfo extends Discussion {
    account: AccountInfo
    parent?: DiscussionInfo
    replies?: DiscussionInfo[]
}