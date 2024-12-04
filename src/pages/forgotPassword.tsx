import { useEffect } from "react"
import { FormTitle } from "~/services/constants/styled"
import { Input } from 'antd';
import type { GetProps } from 'antd';
import { useGlobalDataContext } from "~/hooks/globalData";
import AccountAPI from '~/services/actions/account'
import { useNavigate } from "react-router-dom";
import { PATH } from "~/services/constants/navbarList";
import { toast } from "react-toastify";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const ForgotPassword = () => {
    const title = 'Quên mật khẩu'
    const { setEmailSend, setIsLoading } = useGlobalDataContext();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = title
    }, [])

    const onSearch: SearchProps['onSearch'] = async (value) => {
        setIsLoading(true)
        try {
            const { status, message } = await AccountAPI.getCode(value, true)

            if (status === 200) {
                toast.success(message)
                setEmailSend(value)
                setIsLoading(false)
                navigate(PATH.NEW_PASSWORD)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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