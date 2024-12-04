import { Account } from "~/services/types/account"
import { Document } from "~/services/types/document"
import { Post } from "~/services/types/post"

export interface Format {
    format_Id?: string
    format_name: string
    format_accept: string
    format_description: string
}

export interface FormatInfo extends Format {
    documents: Document[]
    posts: Post[]
    account: Account
}

export interface FormatAll {
    count: number
    formats: FormatInfo[]
}