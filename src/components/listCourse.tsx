import { Button, Col, Flex, Form, Input, Modal, Rate, Row, Select, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EyeOutlined, FileUnknownOutlined, FilterOutlined, OrderedListOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import ButtonEdit from '~/services/utils/buttonEdit';
import cardImg from '~/assets/images/work.jpeg'
import { Link } from 'react-router-dom';
import { Option } from '~/services/types/dataType';

interface DataType {
    key: string;
    name: string;
    category: string;
    teacher: string;
    price: number;
}

type FieldType = {
    role?: string;
    title?: string;
};

const BoxText = styled.div`
    &>span:first-child {
        font-weight: 600;
    }
`

const Image = styled.span`
    display: block;
    border-radius: 4px;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }
`

interface PropsType {
    children: React.ReactNode
    title: string
    isAction?: boolean
}

const ListCourse = ({ children, title, isAction }: PropsType) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.title = title
    }, [])

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Lĩnh vực',
            dataIndex: 'category',
            key: 'category',
            width: '30%',
            render: (_, data) => (
                <Typography.Paragraph
                    ellipsis={{ rows: 4, expandable: false }}
                >
                    {data.category}
                </Typography.Paragraph>
            ),
        },
        {
            title: 'Người dạy',
            dataIndex: 'teacher',
            key: 'teacher',
            width: '20%',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Flex
                    align='center'
                    justify='flex-start'
                    gap={10}
                    wrap='wrap'
                >
                    <Button
                        type="primary"
                        onClick={() => handleClickWatch(record.key)}
                    >
                        <EyeOutlined />
                    </Button>
                    {
                        isAction &&
                        <>
                            <Link to={'/course-update/d'}>
                                <ButtonEdit />
                            </Link>
                            <Link to={'/teacher/manager-lesson/ddd'}>
                                <Button
                                    type='primary'
                                    style={{ backgroundColor: '#f9ca24' }}
                                >
                                    <OrderedListOutlined />
                                </Button>
                            </Link>
                            <Link to={'/teacher/exam/hh'}>
                                <Button
                                    type='primary'
                                    style={{ backgroundColor: '#130f40' }}
                                >
                                    <FileUnknownOutlined />
                                </Button>
                            </Link>
                        </>
                    }
                </Flex>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            category: 'Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team.',
            teacher: 'New York No. 1 Lake Park',
            price: 32,
        },
        {
            key: '2',
            name: 'John Brown',
            category: 'New York No. 1 Lake Park',
            teacher: 'New York No. 1 Lake Park',
            price: 32,
        },
        {
            key: '3',
            name: 'John Brown',
            category: 'New York No. 1 Lake Park',
            teacher: 'New York No. 1 Lake Park',
            price: 32,
        },
    ];

    const options: Option[] = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled' },
    ]

    const handleClickWatch = (key: string) => {
        console.log(key)
        setOpen(true);
    }

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>
            {children}
            <Form>
                <Flex
                    align='center'
                    justify='flex-end'
                    gap={10}
                    style={{ marginBottom: '15px' }}
                >
                    <Form.Item<FieldType>
                        name="title"
                        style={{
                            marginBottom: 0,
                            width: '40%'
                        }}
                    >
                        <Input placeholder='Tên khóa học...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="role"
                        style={{ marginBottom: 0 }}
                    >
                        <Select
                            defaultValue={options[0].value}
                            style={{ width: 120 }}
                            onChange={handleChange}
                            options={options}
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                    >
                        <FilterOutlined />
                    </Button>
                </Flex>
            </Form>
            <Table columns={columns} dataSource={data} />
            <Modal
                title="Thông tin khóa học"
                open={open}
                onCancel={handleCancel}
                footer={
                    <Button type="primary" onClick={handleOk}>
                        OK
                    </Button>
                }
            >
                <Typography.Title
                    level={4}
                    style={{ textAlign: 'center', marginBottom: '10px' }}
                >
                    Lập trinh Website với ReactJS
                </Typography.Title>
                <Flex
                    align='center'
                    justify='center'
                    style={{ paddingBottom: '15px' }}
                >
                    <Rate allowHalf defaultValue={2.5} />
                </Flex>
                <Row gutter={[10, 10]}>
                    <Col span={8}>
                        <Image>
                            <img src={cardImg} alt="" />
                        </Image>
                    </Col>
                    <Col span={16}>
                        <BoxText>
                            <span>Lĩnh vực: </span> công nghệ thông tin
                        </BoxText>
                        <BoxText>
                            <span>Người dạy: </span> Peter
                        </BoxText>
                        <BoxText>
                            <span>Yêu cầu: </span>Không
                        </BoxText>
                        <BoxText>
                            <span>Giá: </span> Không
                        </BoxText>
                        <BoxText>
                            <span>Ngày tạo: </span>06/09/2024
                        </BoxText>
                        <BoxText>
                            <span>Cập nhật gần nhất: </span>06/09/2024
                        </BoxText>
                    </Col>
                </Row>
                <BoxText>
                    <span>Nội dung: </span>
                    <Typography.Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}>
                        Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
                        Design, a design language for background applications, is refined by Ant UED Team. Ant
                        Design, a design language for background applications, is refined by Ant UED Team. Ant
                        Design, a design language for background applications, is refined by Ant UED Team. Ant
                        Design, a design language for background applications, is refined by Ant UED Team. Ant
                        Design, a design language for background applications, is refined by Ant UED Team.
                    </Typography.Paragraph>
                </BoxText>
            </Modal>
        </>
    )
}

export default ListCourse