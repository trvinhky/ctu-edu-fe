import api from "~/config/api"

class EduAPI {
    protected config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }

    protected async getAPI(url: string) {
        try {
            const res = await api.get(url)
            return {
                data: res?.data?.data,
                message: res?.data?.message,
                status: res.status
            }
        } catch (err: any) {
            if (err.response) {
                return {
                    status: err.response.status,
                    message: err.response.data?.message,
                    data: err.response.data?.data
                }
            }

            throw new Error(err.message || "An unknown error occurred");
        }
    }

    protected async putAPI(url: string, data: object, isConfig?: boolean) {
        try {
            const res = await api.put(url, data, isConfig ? this.config : {})
            return {
                data: res?.data?.data,
                message: res?.data?.message,
                status: res.status
            }
        } catch (err: any) {
            if (err.response) {
                return {
                    status: err.response.status,
                    message: err.response.data?.message,
                    data: err.response.data?.data
                }
            }

            throw new Error(err.message || "An unknown error occurred");
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
        } catch (err: any) {
            if (err.response) {
                return {
                    status: err.response.status,
                    message: err.response.data?.message,
                    data: err.response.data?.data
                }
            }

            throw new Error(err.message || "An unknown error occurred");
        }
    }

    protected async postAPI(url: string, data: object, isConfig?: boolean) {
        try {

            const res = await api.post(url, data, isConfig ? this.config : {})
            return {
                data: res?.data?.data,
                message: res?.data?.message,
                status: res.status
            }
        } catch (err: any) {
            if (err.response) {
                return {
                    status: err.response.status,
                    message: err.response.data?.message,
                    data: err.response.data?.data
                }
            }

            throw new Error(err.message || "An unknown error occurred");
        }
    }
}

export default EduAPI