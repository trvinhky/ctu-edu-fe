import { Account } from "~/services/types/account"
import { Format } from "~/services/types/format"
import { Status } from "~/services/types/status"

export interface Post {
    post_Id?: string
    post_title: string
    post_content: string
    post_url?: string
    post_sub?: string
    post_year: number
    post_page?: number
    post_capacity?: number
    post_author: string
    status_Id?: string
    format_Id?: string
    account_Id?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface PostInfo extends Post {
    status: Status
    format: Format
    account: Account
}

export interface PostAll {
    count: number
    posts: PostInfo[]
}