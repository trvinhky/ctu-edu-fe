import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { DocumentAll, DocumentInfo } from "~/services/types/document"

const url = (path: string = '') => `/document/${path}`

export interface DocumentParams {
    format?: string
    store?: string
    title?: string
    score?: number
    page?: number
    limit?: number
}

class DocumentService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data, true)
    }

    public async getOne(id: string): Promise<APIType<DocumentInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(id: string, data: FormData): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${id}`), data, true)
    }

    public async getAll({ title, store, format, page = 1, limit = 6, score }: DocumentParams): Promise<APIType<DocumentAll>> {
        let params = url(`all?page=${page}&limit=${limit}`)

        if (score) params += `&score=${score}`
        if (store) params += `&store=${store}`
        if (format) params += `&format=${format}`
        if (title) params += `&title=${title}`

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const DocumentAPI = new DocumentService()

export default DocumentAPI