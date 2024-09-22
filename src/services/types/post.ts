import { AccountInfo } from "~/services/types/account"
import { Status } from "~/services/types/status"
import { Subject } from "~/services/types/subject"

export interface Post {
    post_Id: string
    post_title: string
    post_content: string
    status_Id: string
    subject_Id: string
    auth_Id: string
}

export interface PostInfo extends Post {
    status: Status
    subject: Subject
    auth: AccountInfo
}