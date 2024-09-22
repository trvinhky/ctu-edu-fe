import EduAPI from "~/services/actions";
import { APIType } from "~/services/types/dataType";
import { Role, RoleAll, RoleInfo } from "~/services/types/role";

const url = (path: string = '') => `/role/${path}`

class RoleService extends EduAPI {
    public async create(data: Role): Promise<APIType<undefined>> {
        return await this.postAPI(url('create'), data)
    }

    public async getOneByName(name: string): Promise<APIType<RoleInfo>> {
        return await this.getAPI(url(`name/${name}`))
    }

    public async getOneById(id: string): Promise<APIType<RoleInfo>> {
        return await this.getAPI(url(`info/${id}`))
    }

    public async getAll(page?: number, limit: number = 6): Promise<APIType<RoleAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}`
        }

        return await this.getAPI(params)
    }

    public async getAllByAccount(page?: number, limit: number = 6): Promise<APIType<RoleAll>> {
        let params = url('all')
        if (page && !isNaN(+page)) {
            params += `?page=${page}&limit=${limit}&child=true`
        }

        return await this.getAPI(params)
    }

    public async update(data: Role): Promise<APIType<undefined>> {
        return await this.putAPI(url(`edit/${data.role_Id}`), data)
    }
}

const RoleAPI = new RoleService()

export default RoleAPI