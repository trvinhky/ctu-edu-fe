import { Format } from "~/services/types/format.ts"
import { Store } from "~/services/types/store"

export interface Document {
    document_Id?: string
    document_title: string
    document_content?: string
    document_url: string
    document_score: number
    format_Id: string
    store_Id: string
}

export interface DocumentInfo extends Document {
    format: Format
    store?: Store
}

export interface DocumentAll {
    count: number
    documents: DocumentInfo[]
}