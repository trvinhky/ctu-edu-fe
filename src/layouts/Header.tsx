import Logo from "~/components/logo"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, Button, Flex, Input, Popconfirm, PopconfirmProps, Popover } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { useState } from "react";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";

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
    const confirm: PopconfirmProps['onConfirm'] = (e) => {
        console.log(e);
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
    };

    return (
        <ul>
            <Item>
                <Link to={'/info/adadad'}>
                    Trang cá nhân
                </Link>
            </Item>
            <Popconfirm
                title="Đăng xuất"
                description="Bạn có chắc muốn đăng xuất?"
                onConfirm={confirm}
                onCancel={cancel}
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
    const [searchValue, setSearchValue] = useState<string>()
    const navigate = useNavigate()

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(info?.source, value);
        setSearchValue(value)
        navigate(`/search?title=${value}`)
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
                    <Flex
                        align="center"
                        justify="flex-end"
                        gap='10px'
                    >
                        <Search
                            placeholder="Tìm kiếm"
                            onSearch={onSearch}
                            style={{ width: 300 }}
                            value={searchValue}
                        />
                        {
                            true ?
                                <Popover content={ListOptions} title="Peter">
                                    <Avatar size="large" icon={<UserOutlined />} />
                                </Popover> :
                                <>
                                    <Button
                                        type="primary"
                                        onClick={() => navigate('/login')}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/register')}
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