import { Avatar, Popconfirm, PopconfirmProps } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styled from 'styled-components'

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

const CardAvatar = () => {
    const confirm: PopconfirmProps['onConfirm'] = (e) => {
        console.log(e);
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
    };

    return (
        <Wrapper>
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
                <Name>Admin</Name>
                <Popconfirm
                    title="Đăng xuất"
                    description="Bạn có chắc muốn đăng xuất?"
                    onConfirm={confirm}
                    onCancel={cancel}
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