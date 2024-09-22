import { Category } from "~/services/types/category"

export interface Resource {
    resource_Id: string
    resource_url: string
    lesson_Id: string
    category_Id: string
}

export interface ResourceInfo extends Resource {
    category: Category
}