import api from "~/config/api"

class EduAPI {
    protected async getAPI(url: string) {
        try {
            const res = await api.get(url)
            return {
                data: res?.data?.data,
                message: res?.data?.message,
                status: res.status
            }
        } catch (err) {

            throw new Error(err as string)
        }
    }

    protected async putAPI(url: string, data: object) {
        try {
            const res = await api.put(url, data)
            return {
                data: res?.data?.data,
                message: res?.data?.message,
                status: res.status
            }
        } catch (err) {
            throw new Error(err as string)
        }
    }

    protected async deleteAPI(url: string) {
        try {
            const res = await api.delete(url)
            return {
                data: res?.data?.data,
                message: res?.data?.message,
                status: res.status
            }
        } catch (err) {
            throw new Error(err as string)
        }
    }

    protected async postAPI(url: string, data: object) {
        try {
            const res = await api.post(url, data)
            return {
                data: res?.data?.data,
                message: res?.data?.message,
                status: res.status
            }
        } catch (err) {
            throw new Error(err as string)
        }
    }
}

export default EduAPI