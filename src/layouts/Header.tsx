import Logo from "~/components/logo"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, Button, Flex, Input, Popconfirm, PopconfirmProps, Popover } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { useEffect, useState } from "react";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors";
import { NAVBARHEADER, PATH } from '~/services/constants/navbarList'
import AccountAPI from '~/services/actions/account'
import { useGlobalDataContext } from '~/hooks/globalData'
import { logOut, setInfo } from "~/services/reducers/accountSlice";
import { toast } from "react-toastify";

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

const NavBarHeader = styled.nav`
    display: flex;
    gap: 10px;

    a {
        display: inline-block;
        padding: 4px 13px;
        color: #000;
        font-weight: 700;
    }

    @media screen and (max-width: 768px) {
        display: none;
    }
`

const NavBarItem = styled.span<{ $isActive?: boolean }>`
    a {
        color: ${props => props.$isActive ? '#1677ff' : '#000'};
    }
`

const Box = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;

    @media screen and (max-width: 768px) {
        display: none;
    }
`

const ListOptions = () => {
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
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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
    const token = useSelector(accountTokenSelector)
    const dispatch = useDispatch();

    const onSearch: SearchProps['onSearch'] = (value) => {
        navigate(`${PATH.SEARCH}?title=${value}`)
    }

    const getAccountName = async () => {
        setIsLoading(true)
        if (info) {
            setAccountName(info.account_name)
        } else {
            try {
                const { data, status } = await AccountAPI.getOne()
                if (status === 201) {
                    dispatch(setInfo(data))
                    setAccountName(data.account_name)
                }
            } catch (e) {
                toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
            }
        }

        setIsLoading(false)
    }

    useEffect(() => {
        if (token) {
            getAccountName()
        }
    }, [token])

    const checkActive = (path: string) => {
        const localPath = location.pathname.replace("/", "")
        const pathConvert = path.replace("/", "")
        if (localPath && pathConvert) {
            return location.pathname.includes(path)
        } else if (!localPath && !pathConvert) {
            return true
        } else return false
    }

    return (
        <Wrapper>
            <div className="container">
                <Flex
                    align="center"
                    justify="space-between"
                    gap='20px'
                >
                    <Logo />
                    <NavBarHeader>
                        {
                            NAVBARHEADER.map((item) => (
                                <NavBarItem key={item.key} $isActive={checkActive(item.key)}>
                                    {item.label}
                                </NavBarItem>
                            ))
                        }
                    </NavBarHeader>
                    <Box>
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
                    </Box>
                </Flex>
            </div>
        </Wrapper>
    )
}

export default Header