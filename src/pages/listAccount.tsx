import { Button, Flex, Form, Modal, Select, Table } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { ExclamationCircleFilled, FilterOutlined, LockOutlined } from '@ant-design/icons';
import { Title } from '~/services/constants/styled';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useGlobalDataContext } from '~/hooks/globalData';
import AccountAPI, { AccountParams } from '~/services/actions/account';
import { ROLE_OPTIONS } from '~/services/constants';
import { useSelector } from 'react-redux';
import { accountInfoSelector } from '~/services/reducers/selectors';
import { toast } from 'react-toastify';

interface DataType {
    key: number;
    name: string;
    email: string;
    role: string;
    id: string;
    status: boolean
}

type FieldType = {
    status?: boolean;
    role?: boolean;
};

const Wrapper = styled.section`
    .list-account__stt {
        display: block;
        text-align: center;
    }
`

const ListAccount = () => {
    const title = 'Danh sách tài khoản'
    const { setIsLoading } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const accountInfo = useSelector(accountInfoSelector)

    useEffect(() => {
        document.title = title
        getAllAccount({
            page: pagination.current,
            limit: pagination.pageSize
        })
    }, [pagination.current, pagination.pageSize])

    const getAllAccount = async (params: AccountParams) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await AccountAPI.getAll(params)
            if (status === 201) {
                setDataTable(
                    data.accounts?.map((account, i) => {
                        const result: DataType = {
                            key: (i + 1),
                            name: account.account_name,
                            id: account.account_Id,
                            email: account.account_email,
                            role: account.account_admin ? 'Admin' : 'Người dùng',
                            status: account.account_band ?? false
                        }

                        return result
                    }
                    )
                )
                setPagination({
                    current: params.page ?? 1,
                    pageSize: params.limit ?? 6,
                    total: data.count
                })
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => <span>{text ? 'Khóa' : 'Không'}</span>
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Flex gap={10}>
                    {accountInfo?.account_Id && accountInfo.account_Id !== record.id &&
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: `${record.status ? '#27ae60' : '#c0392b'}`
                            }}
                            onClick={() => handleClockAccount(record.id, !record.status)}
                        >
                            <LockOutlined />
                        </Button>
                    }
                </Flex>
            ),
        }
    ];

    const clockAccount = async (id: string, isClock: boolean) => {
        setIsLoading(true)
        try {
            const { status, message } = await AccountAPI.update({
                account_Id: id,
                account_band: isClock
            })

            if (status === 200) {
                toast.success(message)
                await getAllAccount({
                    page: pagination.current,
                    limit: pagination.pageSize
                })
            } else toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const handleClockAccount = async (idTarget: string, isClock: boolean = true) => {
        Modal.confirm({
            title: `Bạn có chắc muốn${!isClock ? ' mở' : ''} khóa tài khoản này?`,
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                await clockAccount(idTarget, isClock)
            },
            onCancel() { },
        });
    }

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        await getAllAccount({
            page: pagination.current,
            limit: pagination.pageSize,
            role: values.role,
            active: values.status
        })
    }

    return (
        <Wrapper>
            <Title>{title}</Title>
            <Form
                initialValues={{}}
                onFinish={onFinish}
            >
                <Flex
                    align='center'
                    justify='flex-end'
                    gap={10}
                    style={{ marginBottom: '15px', width: '100%' }}
                >
                    <Form.Item<FieldType>
                        name="role"
                        style={{
                            marginBottom: 0,
                            flex: 1
                        }}
                    >
                        <Select
                            style={{ width: '100%' }}
                            options={ROLE_OPTIONS}
                            placeholder="Chọn role"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="status"
                        style={{
                            marginBottom: 0,
                            flex: 1
                        }}
                    >
                        <Select
                            options={[
                                { value: true, label: 'Khóa' },
                                { value: false, label: 'Không' }
                            ]}
                            placeholder="Chọn trạng thái"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        <FilterOutlined />
                    </Button>
                </Flex>
            </Form>
            <Table
                columns={columns}
                dataSource={dataTable}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
            />
        </Wrapper>
    )
}

export default ListAccount