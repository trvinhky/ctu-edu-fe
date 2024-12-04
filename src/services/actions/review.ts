import EduAPI from "~/services/actions";
import { APIType } from "~/services/types/dataType";
import { Review, ReviewAll, ReviewInfo } from "~/services/types/review";

const url = (path: string = '') => `/review/${path}`

export interface ParamsReview {
    page?: number;
    ratings?: number;
    document?: string;
    account?: string;
    limit?: number;
}

class ReviewService extends EduAPI {
    public async create(data: Review): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<ReviewInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(data: ParamsReview): Promise<APIType<ReviewAll>> {
        const { page, limit, account, document, ratings } = data
        let params = url('all?')
        if (page && !isNaN(+page)) {
            params += `page=${page}&limit=${limit ?? 6}`
        }

        if (account) params += `&account=${account}`
        if (document) params += `&document=${document}`
        if (ratings) params += `&ratings=${ratings}`

        return await this.getAPI(params)
    }
}

const ReviewAPI = new ReviewService()

export default ReviewAPI