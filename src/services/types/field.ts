import { Course } from "~/services/types/course"

export interface Field {
    field_Id: string
    field_name: string
    field_description?: string
}

export interface FieldInfo extends Field {
    courses: Course[]
}