import { Button, Flex, Select, Table } from 'antd';
import type { TableProps } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Title } from '~/services/constants/styled';
import styled from 'styled-components';
import { useEffect } from 'react';
import { Option } from '~/services/types/dataType';

interface DataType {
    key: string;
    name: string;
    age: number;
    email: string;
    role: string;
}

const Wrapper = styled.section`
    .list-account__stt {
        display: block;
        text-align: center;
    }
`

const ListAccount = () => {
    const title = 'Danh sách tài khoản'
    useEffect(() => {
        document.title = title
    }, [])

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

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            email: 'New York No. 1 Lake Park',
            role: 'admin'
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            email: 'London No. 1 Lake Park',
            role: 'admin'
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            email: 'Sydney No. 1 Lake Park',
            role: 'admin'
        },
    ];

    const options: Option[] = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled' },
    ]

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
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
                    defaultValue={options[0].value}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={options}
                />
                <Button
                    type="primary"
                >
                    <FilterOutlined />
                </Button>
            </Flex>
            <Table columns={columns} dataSource={data} />
        </Wrapper>
    )
}

export default ListAccount