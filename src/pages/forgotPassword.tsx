import { useEffect } from "react"
import { FormTitle } from "~/services/constants/styled"
import { Input } from 'antd';
import type { GetProps } from 'antd';
import { useGlobalDataContext } from "~/hooks/globalData";
import { isValidEmail } from "~/services/constants/validation";
import AccountAPI from '~/services/actions/account'
import { useNavigate } from "react-router-dom";
import { PATH } from "~/services/constants/navbarList";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const ForgotPassword = () => {
    const title = 'Quên mật khẩu'
    const { setEmailSend, setIsLoading, messageApi } = useGlobalDataContext();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = title
    }, [])

    const onSearch: SearchProps['onSearch'] = async (value) => {
        if (isValidEmail(value)) {
            messageApi.open({
                type: 'warning',
                content: 'Vui lòng nhập email của bạn!',
                duration: 3,
            });
        }

        setIsLoading(true)
        try {
            const { status } = await AccountAPI.getCode(value)
            if (status === 200) {
                setEmailSend(value)
                messageApi.open({
                    type: 'success',
                    content: 'Vui lòng kiểm tra gmail của bạn!',
                    duration: 3,
                });
                setIsLoading(false)
                navigate(PATH.NEW_PASSWORD)
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Gửi email thất bại!',
                    duration: 3,
                });
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    return (
        <div>
            <FormTitle>{title}</FormTitle>
            <Search
                placeholder="Nhập email của bạn"
                enterButton="OK"
                size="large"
                onSearch={onSearch}
                style={{ width: '40vw' }}
            />
        </div>
    )
}

export default ForgotPassword