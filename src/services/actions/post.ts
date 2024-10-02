import EduAPI from "~/services/actions"
import { APIType } from "~/services/types/dataType"
import { Post, PostAll, PostInfo } from "~/services/types/post"

const url = (path: string = '') => `/post/${path}`

export interface ParamsAll {
    page?: number;
    status?: string;
    subject?: string;
    auth?: string;
    title?: string;
    limit?: number;
}

class PostService extends EduAPI {
    public async create(data: Post): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async update(data: Post): Promise<APIType<undefined>> {
        return await this.putAPI(url(`auth/${data.post_Id}`), data)
    }

    public async updateStatus(id: string, status_Id: string): Promise<APIType<undefined>> {
        return await this.putAPI(url(`status/${id}`), { status_Id })
    }

    public async getOne(id: string): Promise<APIType<PostInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(data: ParamsAll): Promise<APIType<PostAll>> {
        const { page, limit, status, auth, title, subject } = data
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit ?? 6}`
        }

        if (status) params += `&status=${status}`
        if (auth) params += `&auth=${auth}`
        if (title) params += `&title=${title}`
        if (subject) params += `&subject=${subject}`

        return await this.getAPI(params)
    }

    public async delete(id: string): Promise<APIType<undefined>> {
        return await this.deleteAPI(url(`${id}`))
    }
}

const PostAPI = new PostService()

export default PostAPI