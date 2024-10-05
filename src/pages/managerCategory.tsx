import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Input, Modal, Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import CategoryAPI from "~/services/actions/category";
import { Title } from "~/services/constants/styled";
import ButtonEdit from "~/services/utils/buttonEdit";

type FieldType = {
    category_name?: string
    category_accept?: string
    category_description?: string
};

interface DataType {
    key: number;
    name: string;
    lessons: number;
    questions: number;
    id: string;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const ManagerCategory = () => {
    const title = 'Danh sách loại file'
    const [form] = Form.useForm<FieldType>();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [idCategory, setIdCategory] = useState<string>()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllCategory(pagination.current, pagination.pageSize)
    }, [pagination.current, pagination.pageSize])

    const getAllCategory = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CategoryAPI.getAll(page, limit)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.categories.map((category, i) => {
                        const result: DataType = {
                            key: (i + 1),
                            id: category.category_Id as string,
                            name: category.category_name,
                            questions: category.questions.length ?? 0,
                            lessons: category.lessons.length ?? 0
                        }

                        return result
                    })
                )
                setPagination({
                    current: page ?? 1,
                    pageSize: limit,
                    total: data.count
                })
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
            title: 'Tên loại file',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng câu hỏi',
            dataIndex: 'questions',
            key: 'questions',
        },
        {
            title: 'Số lượng bài học',
            dataIndex: 'lessons',
            key: 'lessons',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <div onClick={() => showModal(record.id)}>
                    <ButtonEdit />
                </div>
            )
        }
    ];

    const getOneCategory = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await CategoryAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setIdCategory(data.category_Id)
                form.setFieldsValue({
                    category_accept: data.category_accept,
                    category_description: data.category_description,
                    category_name: data.category_name
                })
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

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const showModal = async (id?: string) => {
        if (id) {
            setIdCategory(id)
            await getOneCategory(id)
        } else {
            form.resetFields()
            setIdCategory('')
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''
            if (idCategory) {
                const res = await CategoryAPI.update({
                    category_name: values.category_name as string,
                    category_accept: values.category_accept as string,
                    category_description: values.category_description as string,
                    category_Id: idCategory as string
                })
                status = res.status
                message = res.message as string
            } else {
                const res = await CategoryAPI.create({
                    category_name: values.category_name as string,
                    category_accept: values.category_accept as string,
                    category_description: values.category_description as string
                })
                status = res.status
                message = res.message as string
                form.resetFields()
            }
            if (status === 200) {
                await getAllCategory(1)
            }
            messageApi.open({
                type: status === 200 ? "success" : "error",
                content: message,
                duration: 3,
            });
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    return (
        <>
            <Title>{title}</Title>
            <Flex
                justify="flex-end"
                style={{
                    paddingBottom: '20px'
                }}
            >
                <Button
                    type="primary"
                    style={{
                        backgroundColor: '#27ae60'
                    }}
                    onClick={() => showModal()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Table
                columns={columns}
                dataSource={dataTable}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
            />
            <Form
                layout="vertical"
                name="category"
                form={form}
                onFinish={onFinish}
                initialValues={{}}
            >
                <Modal
                    title={`${idCategory ? 'Cập nhật' : 'Thêm'} loại file`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <React.Fragment key="action">
                            {
                                idCategory ?
                                    <WrapperBtn onClick={handleOk}>
                                        <ButtonEdit text="Cập nhật" htmlType="submit" form="category" />
                                    </WrapperBtn>
                                    :
                                    <Button type="primary" onClick={handleOk} htmlType="submit" form="category">
                                        Thêm
                                    </Button>
                            }
                        </React.Fragment>
                    ]}
                >
                    <Form.Item<FieldType>
                        name="category_name"
                        label="Tên loại file"
                    >
                        <Input
                            placeholder="Tên loại file"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="category_accept"
                        label="Phần mở rộng"
                    >
                        <Input
                            placeholder="phần mở rộng (các đuôi file cách nhau dấu ',')"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="category_description"
                        label="Mô tả"
                    >
                        <Input
                            placeholder="Mô tả"
                        />
                    </Form.Item>
                </Modal>
            </Form>
        </>
    )
}

export default ManagerCategory