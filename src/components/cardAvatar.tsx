import { Avatar, Popconfirm, PopconfirmProps } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import AccountAPI from '~/services/actions/account'
import { useGlobalDataContext } from '~/hooks/globalData'
import { useNavigate } from 'react-router-dom'
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import { PATH } from '~/services/constants/navbarList'

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
    const { setIsLoading, messageApi } = useGlobalDataContext();

    const confirm: PopconfirmProps['onConfirm'] = async () => {
        setIsLoading(true)
        try {
            const res = await AccountAPI.logOut()

            if (res.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: res.message,
                    duration: 3,
                });
                setIsLoading(false)
                dispatch(actionsAccount.LogOut())
                navigate(PATH.LOGIN)
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.message,
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