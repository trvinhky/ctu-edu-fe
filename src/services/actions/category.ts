import EduAPI from "~/services/actions"
import { Category, CategoryAll, CategoryInfo } from "~/services/types/category"
import { APIType } from "~/services/types/dataType"

const url = (path: string = '') => `/category/${path}`

class CategoryService extends EduAPI {
    public async create(data: Category): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOne(id: string): Promise<APIType<CategoryInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async update(data: Category): Promise<APIType<undefined>> {
        return await this.putAPI(url(`${data.category_Id}`), data)
    }

    public async getAll(page?: number, limit: number = 6): Promise<APIType<CategoryAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }
}

const CategoryAPI = new CategoryService()

export default CategoryAPI