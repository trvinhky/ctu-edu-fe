import { Button, Flex, Select, Table } from 'antd';
import type { TableProps } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Title } from '~/services/constants/styled';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Option } from '~/services/types/dataType';
import { useGlobalDataContext } from '~/hooks/globalData';
import AccountAPI from '~/services/actions/account';
import RoleAPI from '~/services/actions/role';

interface DataType {
    key: number;
    name: string;
    email: string;
    role: string;
    id: string;
}

const Wrapper = styled.section`
    .list-account__stt {
        display: block;
        text-align: center;
    }
`

const ListAccount = () => {
    const title = 'Danh sách tài khoản'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [roleOptions, setRoleOptions] = useState<Option[]>([])

    useEffect(() => {
        document.title = title
        getAllAccount()
        getAllRole()
    }, [])

    const getAllRole = async () => {
        setIsLoading(true)
        try {
            const { status, data, message } = await RoleAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                setRoleOptions(
                    data.roles.map((role) => {
                        const result: Option = {
                            label: role.role_name,
                            value: role.role_Id as string
                        }

                        return result
                    })
                )
            } else {
                messageApi.open({
                    type: 'error',
                    content: message,
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

    const getAllAccount = async (page?: number, role?: string, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await AccountAPI.getAll(page, role, limit)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.accounts?.map((account, i) => {
                        const result: DataType = {
                            key: (i + 1),
                            name: account.profile.profile_name,
                            id: account.account_Id,
                            email: account.account_email,
                            role: account.role?.role_name ?? 'Không biết'
                        }

                        return result
                    }
                    )
                )
            } else {
                messageApi.open({
                    type: 'error',
                    content: message,
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

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            render: (text) => <span className='list-account__stt'>{text}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        }
    ];

    const handleChange = async (value: string) => {
        await getAllAccount(1, value)
    };

    return (
        <Wrapper>
            <Title>{title}</Title>
            <Flex
                align='center'
                justify='flex-end'
                gap={10}
                style={{ marginBottom: '15px' }}
            >
                <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={roleOptions}
                    placeholder="Chọn role"
                />
                <Button
                    type="primary"
                >
                    <FilterOutlined />
                </Button>
            </Flex>
            <Table columns={columns} dataSource={dataTable} />
        </Wrapper>
    )
}

export default ListAccount