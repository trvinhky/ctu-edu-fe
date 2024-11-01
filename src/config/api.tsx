import axios from "axios";
import store from '~/services/reducers';
import AccountAPI from '~/services/actions/account'
import { actions } from "~/services/reducers/accountSlice";
import { ENV } from "~/services/constants";
import { PATH } from "~/services/constants/navbarList";

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
            store.dispatch(actions.LogOut());
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu là đã thử lại một lần
            try {
                const { data } = await AccountAPI.updateToken();

                if (!Array.isArray(data) && data?.token) {
                    // Cập nhật accessToken mới vào Redux
                    store.dispatch(actions.setToken(data.token));

                    // Cập nhật token vào headers của yêu cầu ban đầu và gửi lại request
                    originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
                }

                window.location.href = PATH.LOGIN
                store.dispatch(actions.LogOut());
                return axios(originalRequest);
            } catch (refreshError) {
                // Nếu refreshToken cũng hết hạn, xóa thông tin xác thực và yêu cầu đăng nhập lại
                window.location.href = PATH.LOGIN
                store.dispatch(actions.LogOut());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api