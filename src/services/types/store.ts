import { DocumentInfo } from "~/services/types/document"

export interface Store {
    store_Id?: string
    store_title: string
    store_image?: string
}

export interface StoreInfo extends Store {
    documents: DocumentInfo[]
}

export interface StoreAll {
    count: number
    stores: StoreInfo[]
}