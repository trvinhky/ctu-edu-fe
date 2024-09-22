import EduAPI from "~/services/actions";
import { APIType } from "~/services/types/dataType";
import { Profile } from "~/services/types/profile";

const url = (path: string = '') => `/profile/${path}`

class ProfileService extends EduAPI {
    public async getOne(id: string): Promise<APIType<Profile>> {
        return await this.getAPI(url(id))
    }

    public async update(data: Profile): Promise<APIType<undefined>> {
        return await this.putAPI(url(`edit/${data.profile_Id}`), data)
    }

    public async updateScore(id: string, score: number): Promise<APIType<undefined>> {
        return await this.putAPI(url(`recharge/${id}`), { profile_score: score })
    }
}

const ProfileAPI = new ProfileService()

export default ProfileAPI