import { Post } from "~/services/types/post"

export interface Status {
    status_Id?: string
    status_name: string
    status_index: 1 | -1 | 0
}

export interface StatusInfo extends Status {
    posts: Post[]
}

export interface StatusAll {
    count: number
    status: StatusInfo[]
}