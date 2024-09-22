import { Course } from "~/services/types/course"
import { Post } from "~/services/types/post"

export interface Subject {
    subject_Id?: string
    subject_name: string
}

export interface SubjectInfo extends Subject {
    courses: Course[]
    posts: Post[]
}