import { Button, Input, Modal, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Title } from '~/services/constants/styled';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface DataType {
    key: string;
    name: string;
    description: string;
    count: number;
}

const Label = styled.label`
    font-weight: 600;
    padding-bottom: 6px;
    display: block;
`

const ListField = () => {
    const title = 'Danh sách lĩnh vực'
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        document.title = title
    }, [])

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tên lĩnh vực',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (_, data) => (
                <Typography.Paragraph
                    ellipsis={{ rows: 4, expandable: false }}
                >
                    {data.description}
                </Typography.Paragraph>
            ),
        },
        {
            title: 'Tổng khóa học',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    style={{ backgroundColor: '#f1c40f' }}
                    onClick={() => handleEdit(record.key)}
                >
                    <EditOutlined />
                </Button>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            description: 'Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team.',
            count: 32,
        },
        {
            key: '2',
            name: 'John Brown',
            description: 'New York No. 1 Lake Park',
            count: 32,
        }
    ];

    const handleEdit = (key: string) => {
        console.log(key)
        setOpenEdit(true);
    }

    const handleSubmitEdit = () => {
        setOpenEdit(false);
    };

    const handleCancelEdit = () => {
        console.log('Clicked cancel button');
        setOpenEdit(false);
    };

    return (
        <section>
            <Title>{title}</Title>
            <Table columns={columns} dataSource={data} />
            <Modal
                title="Cập nhật lĩnh vực"
                open={openEdit}
                onCancel={handleCancelEdit}
                onOk={handleSubmitEdit}
                cancelText='Thoát'
            >
                <Label htmlFor="name">
                    Tên lĩnh vực:
                </Label>
                <Input placeholder="Tên lĩnh vực" id='name' />
            </Modal>
        </section>
    )
}

export default ListField