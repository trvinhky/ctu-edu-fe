import axios from "axios";
import store from '~/services/reducers';
import AccountAPI from '~/services/actions/account'
import { ENV } from "~/services/constants";
import { PATH } from "~/services/constants/navbarList";
import { logOut, setToken } from "~/services/reducers/accountSlice";

const api = axios.create({
    baseURL: ENV.BE_HOST,
    withCredentials: true, // Để cookie chứa refreshToken có thể được gửi
});

api.interceptors.request.use(
    config => {
        const state = store.getState();
        const token = state.account.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra xem error.response có tồn tại hay không
        if (!error.response) {
            store.dispatch(logOut());
            return Promise.reject(error);
        }

        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu là đã thử lại một lần

            try {
                const { data, status } = await AccountAPI.updateToken();

                if (status === 201) {
                    // Cập nhật accessToken mới vào Redux
                    store.dispatch(setToken(data.token));

                    // Cập nhật token vào headers của yêu cầu ban đầu và gửi lại request
                    originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
                }

                window.location.href = PATH.LOGIN
                store.dispatch(logOut());
                return axios(originalRequest);
            } catch (refreshError) {
                // Nếu refreshToken cũng hết hạn, xóa thông tin xác thực và yêu cầu đăng nhập lại
                window.location.href = PATH.LOGIN
                store.dispatch(logOut());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api