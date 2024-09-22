import { AccountInfo } from "~/services/types/account"

export interface Comment {
    comment_Id: string
    comment_content: string
    createdAt: Date
    updatedAt: Date
    post_Id: string
    account_Id: string
    parent_Id?: string
}

export interface CommentInfo extends Comment {
    account: AccountInfo
    parent?: CommentInfo
    replies?: CommentInfo[]
}