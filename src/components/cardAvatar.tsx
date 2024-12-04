import { Avatar, Popconfirm, PopconfirmProps } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import AccountAPI from '~/services/actions/account'
import { useGlobalDataContext } from '~/hooks/globalData'
import { useNavigate } from 'react-router-dom'
import { PATH } from '~/services/constants/navbarList'
import { logOut } from '~/services/reducers/accountSlice'
import { toast } from 'react-toastify'

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 20px 0;
`

const Name = styled.span`
    display: block;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 3px;
`

const LogoutBtn = styled.button`
    color: #fff;
    background-color: rgba(231, 76, 60, 0.7);
    padding: 4px 15px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
`

const CardAvatar = ({ name }: { name: string }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setIsLoading } = useGlobalDataContext();

    const confirm: PopconfirmProps['onConfirm'] = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await AccountAPI.logOut()

            if (status === 200) {
                toast.success(message)
                setIsLoading(false)
                dispatch(logOut())
                navigate(PATH.LOGIN)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    };

    return (
        <Wrapper>
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
                <Name>{name}</Name>
                <Popconfirm
                    title="Đăng xuất"
                    description="Bạn có chắc muốn đăng xuất?"
                    onConfirm={confirm}
                    okText="OK"
                    cancelText="Không"
                >

                    <LogoutBtn>
                        Đăng xuất
                    </LogoutBtn>
                </Popconfirm>
            </div>
        </Wrapper>
    )
}

export default CardAvatar