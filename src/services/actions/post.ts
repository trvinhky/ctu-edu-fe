import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Post, PostAll, PostInfo } from "~/services/types/post"

const url = (path: string = '') => `/post/${path}`

export interface ParamsPost {
    page?: number;
    status?: string;
    format?: string;
    account?: string;
    title?: string;
    limit?: number;
    index?: 1 | -1 | 0;
    auth?: string
    year?: number
    id?: string
    month?: number
}

class PostService extends EduAPI {
    public async create(data: FormData): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data, true)
    }

    public async update(data: Post): Promise<APIType<undefined>> {
        return await this.putAPI(url(`auth/${data.post_Id}`), data)
    }

    public async updateStatus(id: string, status_index: 1 | 0 | -1, score?: number, account_Id?: string): Promise<APIType<undefined>> {
        return await this.putAPI(url(`status/${id}`), { status_index, score, account_Id })
    }

    public async getOne(id: string): Promise<APIType<PostInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(data: ParamsPost): Promise<APIType<PostAll>> {
        const { page = 1, limit, status, account, title, format, index, auth, year, id, month } = data
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit ?? 6}`
        }

        if (status) params += `&status=${status}`
        if (account) params += `&account=${account}`
        if (title) params += `&title=${title}`
        if (format) params += `&format=${format}`
        if (index) params += `&index=${index}`
        if (auth) params += `&auth=${auth}`
        if (year) params += `&year=${year}`
        if (id) params += `&id=${id}`
        if (month) params += `&month=${month}`

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const PostAPI = new PostService()

export default PostAPI