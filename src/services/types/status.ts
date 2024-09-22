import { Post } from "~/services/types/post"

export interface Status {
    status_Id: string
    status_name: string
}

export interface StatusInfo extends Status {
    posts: Post[]
}