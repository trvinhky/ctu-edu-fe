import Logo from "~/components/logo"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, Button, Flex, Input, Popconfirm, PopconfirmProps, Popover } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { useEffect, useState } from "react";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { accountInfoSelector } from "~/services/reducers/selectors";
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import { PATH } from '~/services/constants/navbarList'
import AccountAPI from '~/services/actions/account'
import { useGlobalDataContext } from '~/hooks/globalData'

const { Search } = Input;

const Wrapper = styled.header`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    height: 60px;
    box-shadow: 0 1px 1px #ccc;
`

const Item = styled.li<{ $color?: string }>`
    cursor: pointer;
    font-weight: 500;
    color: ${props => props.$color || "#000"};

    a {
        display: block;
        color: inherit;

        &:hover {
            text-decoration: underline;
        }
    }

    &:hover {
        text-decoration: underline;
    }
`

const ListOptions = () => {
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
        <ul>
            <Item>
                <Link to={PATH.AUTH}>
                    Trang cá nhân
                </Link>
            </Item>
            <Popconfirm
                title="Đăng xuất"
                description="Bạn có chắc muốn đăng xuất?"
                onConfirm={confirm}
                okText="OK"
                cancelText="Không"
            >

                <Item $color="#e74c3c">
                    Đăng xuất
                </Item>
            </Popconfirm>

        </ul>
    )
}

const Header = () => {
    const navigate = useNavigate()
    const { setIsLoading } = useGlobalDataContext();
    const [accountName, setAccountName] = useState<string>()
    const info = useSelector(accountInfoSelector)
    const dispatch = useDispatch();

    const onSearch: SearchProps['onSearch'] = (value) => {
        navigate(`${PATH.SEARCH}?title=${value}`)
    }

    const getAccountName = async () => {
        setIsLoading(true)
        if (info) {
            setAccountName(info.profile.profile_name)
        } else {
            try {
                const { data, status } = await AccountAPI.getOne()
                if (status === 201 && !Array.isArray(data)) {
                    dispatch(actionsAccount.setInfo(data))
                    setAccountName(data.profile.profile_name)
                }
            } catch (e) { }
        }

        setIsLoading(false)
    }

    useEffect(() => {
        getAccountName()
    }, [])

    return (
        <Wrapper>
            <div className="container">
                <Flex
                    align="center"
                    justify="space-between"
                    gap='20px'
                >
                    <Logo />
                    <Flex
                        align="center"
                        justify="flex-end"
                        gap='10px'
                    >
                        <Search
                            placeholder="Tìm kiếm"
                            onSearch={onSearch}
                            style={{ width: 300 }}
                        />
                        {
                            accountName ?
                                <Popover content={ListOptions} title={accountName}>
                                    <Avatar size="large" icon={<UserOutlined />} />
                                </Popover> :
                                <>
                                    <Button
                                        type="primary"
                                        onClick={() => navigate(PATH.LOGIN)}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        onClick={() => navigate(PATH.REGISTER)}
                                    >
                                        Đăng ký
                                    </Button>
                                </>
                        }
                    </Flex>
                </Flex>
            </div>
        </Wrapper>
    )
}

export default Header