import { Type } from "~/services/types/type"

export interface Resource {
    resource_Id: string
    resource_url: string
    lesson_Id: string
    resource_type: string
}

export interface ResourceInfo extends Resource {
    type: Type
}