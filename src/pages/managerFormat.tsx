import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Input, Modal, Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import FormatAPI from "~/services/actions/format";
import { Title } from "~/services/constants/styled";
import ButtonEdit from "~/services/utils/buttonEdit";

type FieldType = {
    format_name?: string
    format_accept?: string
    format_description?: string
};

interface DataType {
    key: number;
    name: string;
    document: number;
    post: number;
    id: string;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const ManagerFormat = () => {
    const title = 'Danh định dạng file'
    const [form] = Form.useForm<FieldType>();
    const { setIsLoading } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formatId, setFormatId] = useState<string>()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllFormat(pagination.current, pagination.pageSize)
    }, [pagination.current, pagination.pageSize])

    const getAllFormat = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await FormatAPI.getAll(page, limit)
            if (status === 201) {
                console.log(data)
                setDataTable(
                    data.formats.map((format, i) => {
                        const result: DataType = {
                            key: (i + 1),
                            id: format.format_Id as string,
                            name: format.format_description,
                            document: format.documents.length ?? 0,
                            post: format.posts.length ?? 0
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
            title: 'Tên định dạng file',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng tài liệu',
            dataIndex: 'post',
            key: 'post',
        },
        {
            title: 'Số lượng bài đăng',
            dataIndex: 'document',
            key: 'document',
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

    const getOneFormat = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await FormatAPI.getOne(id)
            if (status === 201) {
                setFormatId(data.format_Id)
                form.setFieldsValue({
                    format_name: data.format_name,
                    format_accept: data.format_accept,
                    format_description: data.format_description
                })
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const showModal = async (id?: string) => {
        if (id) {
            setFormatId(id)
            await getOneFormat(id)
        } else {
            form.resetFields()
            setFormatId('')
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
            const formatData = {
                format_Id: formatId as string,
                format_accept: values.format_accept as string,
                format_name: values.format_name as string,
                format_description: values.format_description as string
            }
            if (formatId) {
                const res = await FormatAPI.update(formatData)
                status = res.status
                message = res.message as string
            } else {
                const res = await FormatAPI.create(formatData)
                status = res.status
                message = res.message as string
                form.resetFields()
            }
            if (status === 200) {
                toast.success(message)
                await getAllFormat(pagination.current, pagination.pageSize)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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
                name="format"
                form={form}
                onFinish={onFinish}
                initialValues={{}}
            >
                <Modal
                    title={`${formatId ? 'Cập nhật' : 'Thêm'} định dạng file`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <React.Fragment key="action">
                            {
                                formatId ?
                                    <WrapperBtn onClick={handleOk}>
                                        <ButtonEdit text="Cập nhật" htmlType="submit" form="format" />
                                    </WrapperBtn>
                                    :
                                    <Button type="primary" onClick={handleOk} htmlType="submit" form="format">
                                        Thêm
                                    </Button>
                            }
                        </React.Fragment>
                    ]}
                >
                    <Form.Item<FieldType>
                        name="format_name"
                        label="Tên định dạng file"
                    >
                        <Input
                            placeholder="Tên định dạng file"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="format_accept"
                        label="Phần mở rộng"
                    >
                        <Input
                            placeholder="phần mở rộng (các đuôi file cách nhau dấu ',')"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="format_description"
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

export default ManagerFormat