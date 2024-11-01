import { AccountInfo } from "~/services/types/account"
import { Format } from "~/services/types/format"
import { Status } from "~/services/types/status"

export interface Post {
    post_Id?: string
    post_title: string
    post_content: string
    post_url?: string
    status_Id?: string
    format_Id?: string
    account_Id?: string
}

export interface PostInfo extends Post {
    status: Status
    format: Format
    account: AccountInfo
}

export interface PostAll {
    count: number
    posts: PostInfo[]
}