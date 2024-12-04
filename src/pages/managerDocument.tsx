import { DollarOutlined, ExclamationCircleFilled, ExclamationCircleOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, FormProps, Input, InputNumber, List, Modal, Row, Select, Table, TableProps, Tag, Typography, Upload, UploadFile } from "antd"
import { RcFile, UploadProps } from "antd/es/upload"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import ViewURL from "~/components/viewURL"
import { useGlobalDataContext } from "~/hooks/globalData"
import DocumentAPI, { DocumentParams } from "~/services/actions/document"
import { convertDate, convertUrl, DATEFORMAT_FULL } from "~/services/constants"
import { FormatInfo } from "~/services/types/format.ts"
import { Option } from "~/services/types/dataType"
import { DocumentInfo } from "~/services/types/document"
import ButtonBack from "~/services/utils/buttonBack"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"
import FormatAPI from "~/services/actions/format"
import StoreAPI from "~/services/actions/store"
import { Title } from "~/services/constants/styled"
import { toast } from "react-toastify"

type FieldType = {
    document_title?: string
    document_content?: string
    document_score?: number
    format_Id?: string
    store_Id?: string
    document_author?: string
    document_year?: number
};

interface DataType {
    key: string;
    title: string;
    content: string;
    store: string;
    score: number;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const SubTitle = styled.h4`
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 10px;
`

const Description = styled.p`
    padding: 15px 0;
    span {
        display: block;
        font-weight: 500;
    }
`

const TitleContent = styled.span`
    display: block;
    margin-bottom: 15px;
    font-weight: 600 !important;
`

interface ListText {
    title: string
    text: string
}

const ManagerDocument = () => {
    const title = 'Quản lý tài liệu'
    const { id } = useParams();
    const { setIsLoading } = useGlobalDataContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm<FieldType>();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [documentId, setDocumentId] = useState<string | undefined>()
    const [optionFormat, setOptionFormat] = useState<Option[]>()
    const [optionStore, setOptionStore] = useState<Option[]>()
    const [formats, setFormats] = useState<FormatInfo[]>()
    const [acceptFile, setAcceptFile] = useState<string | undefined>()
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [isModalInfo, setIsModalInfo] = useState(false)
    const [documentInfo, setDocumentInfo] = useState<DocumentInfo>()
    const [listText, setListText] = useState<ListText[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        getAllFormat()
        getAllStore()
        getAllDocument({
            page: pagination.current,
            limit: pagination.pageSize,
            store: id
        })
    }, [id, pagination.current, pagination.pageSize])

    const getAllFormat = async () => {
        setIsLoading(true)
        try {
            const { data, message, status } = await FormatAPI.getAll()
            if (status === 201) {
                const result: Option[] = data.formats.map((format) => ({
                    label: format.format_description,
                    value: format.format_Id as string
                }))
                setOptionFormat(result)
                setFormats(data.formats)
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const getAllStore = async () => {
        setIsLoading(true)
        try {
            const { status, data, message } = await StoreAPI.getAll()
            if (status === 201) {
                const result: Option[] = data.stores.map((store) => ({
                    label: store.store_title,
                    value: store.store_Id as string
                }))
                setOptionStore(result)
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const getOneDocument = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await DocumentAPI.getOne(id)
            if (status === 201) {
                form.setFieldsValue({
                    document_title: data.document_title,
                    document_content: data.document_content,
                    document_score: data.document_score,
                    store_Id: data.store_Id,
                    document_author: data.document_author,
                    document_year: data.document_year
                })
                setDocumentInfo(data)
                setListText([
                    {
                        title: 'Số trang',
                        text: data.document_page.toString()
                    },
                    {
                        title: 'Dung lượng',
                        text: data.document_capacity.toString()
                    },
                    {
                        title: 'Kho tài liệu',
                        text: data.store?.store_title as string
                    },
                    {
                        title: 'Năm xuất bản',
                        text: data.document_year.toString()
                    },
                    {
                        title: 'Điểm tích lũy',
                        text: data.document_score.toString()
                    },
                    {
                        title: 'Tác giả',
                        text: data.document_author
                    },
                    {
                        title: 'Ngày tạo',
                        text: convertDate((data.createdAt as Date).toString(), DATEFORMAT_FULL)
                    },
                    {
                        title: 'Ngày cập nhật',
                        text: convertDate((data.updatedAt as Date).toString(), DATEFORMAT_FULL)
                    },
                ])
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const getAllDocument = async (params: DocumentParams) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await DocumentAPI.getAll(params)
            if (status === 201) {
                setDataTable(
                    data.documents?.map((document) => {
                        const result: DataType = {
                            key: document.document_Id as string,
                            content: document.document_content || 'Không',
                            title: document.document_title,
                            score: document.document_score ?? 0,
                            store: document.store?.store_title as string
                        }

                        return result
                    })
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''

            const data = new FormData()
            data.append('document_title', values.document_title as string)
            data.append('document_author', values.document_author as string)
            data.append('document_year', (values.document_year as number).toString())
            if (values.document_content) {
                data.append('document_content', values.document_content)
            }
            data.append('store_Id', (id ? id : values.store_Id) as string)
            data.append('document_score', values.document_score ? values.document_score.toString() : '0')
            data.append('format_Id', values.format_Id as string)
            if (fileList.length > 0) {
                const file = fileList[0].originFileObj as File;
                data.append("file", file);
            }

            if (documentId) {
                data.append('document_Id', documentId as string)
                const res = await DocumentAPI.update(
                    documentId,
                    data
                )
                status = res.status
                message = res.message as string
            } else {
                const res = await DocumentAPI.create(data)
                status = res.status
                message = res.message as string
                setFileList([])
                form.resetFields()
            }
            if (status === 200) {
                await getAllDocument({
                    store: id as string,
                    page: pagination.current,
                    limit: pagination.pageSize
                })
                toast.success(message)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '30%'
        },
        {
            title: 'Mô tả',
            dataIndex: 'content',
            key: 'content',
            width: '35%',
            render: (text) => (
                <Typography.Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}>
                    {text}
                </Typography.Paragraph>
            )
        },
        {
            title: 'Số điểm',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Flex gap={10}>
                    <Button
                        type="primary"
                        onClick={() => handleShowInfo(record.key)}
                    >
                        <EyeOutlined />
                    </Button>
                    <div
                        onClick={() => showModal(record.key)}
                    >
                        <ButtonEdit />
                    </div>
                    <div onClick={() => showPromiseConfirm(record.key)}>
                        <ButtonDelete />
                    </div>
                </Flex>
            ),
        }
    ];

    const handleShowInfo = async (id: string) => {
        await getOneDocument(id)
        setIsModalInfo(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        if (form.getFieldValue('document_title'))
            setIsModalOpen(false);
    };

    const showModal = async (id?: string) => {
        if (id) {
            setDocumentId(id)
            await getOneDocument(id)
        } else {
            form.resetFields()
            setDocumentId(undefined)
        }
        setIsModalOpen(true);
    };

    const confirmDelete = async (idTarget: string) => {
        setIsLoading(true)
        try {
            const { message, status } = await DocumentAPI.delete(idTarget)
            if (status === 200) await getAllDocument({
                store: id as string,
                page: pagination.current,
                limit: pagination.pageSize
            })

            if (status === 200) toast.success(message)
            else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const showPromiseConfirm = (idTarget: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa tài liệu này?',
            icon: <ExclamationCircleFilled />,
            content: <Tag icon={<ExclamationCircleOutlined />} color="error">
                Lưu ý: Chỉ xóa được khi tài liệu này chưa được mua.
            </Tag>,
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(idTarget)
            },
            onCancel() { },
        });
    };

    const handleChangeOption = (value: string) => {
        const data = formats?.find((format) => format.format_Id === value)
        setAcceptFile(data?.format_accept)
    };

    const handleBeforeUpload = (file: RcFile) => {
        // Nếu fileList đã có file, không cho phép chọn thêm
        if (fileList.length >= 1) {
            return Upload.LIST_IGNORE;
        }

        // Cập nhật fileList với file mới
        setFileList([file]);
        return false; // Ngăn việc tự động upload
    };

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Title>
                {title}
            </Title>
            <Flex justify="space-between" style={{ paddingBottom: 15 }}>
                <ButtonBack />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={() => showModal()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Table
                columns={columns}
                dataSource={dataTable}
                rowKey="key"
                pagination={pagination}
                onChange={handleTableChange}
            />
            <Form
                layout="vertical"
                name="document"
                form={form}
                onFinish={onFinish}
            >
                <Modal
                    title={`${documentId ? 'Cập nhật' : 'Thêm'} tài liệu`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <React.Fragment key="action">
                            {
                                documentId ?
                                    <WrapperBtn onClick={handleOk}>
                                        <ButtonEdit text="Cập nhật" htmlType="submit" form="document" />
                                    </WrapperBtn>
                                    :
                                    <Button type="primary" onClick={handleOk} htmlType="submit" form="document">
                                        Thêm
                                    </Button>
                            }
                        </React.Fragment>
                    ]}
                >
                    <Form.Item<FieldType>
                        name="document_title"
                        label="Tiêu đề"
                        required
                    >
                        <Input />
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                name="document_author"
                                label="Tác giả"
                                required
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                name="document_year"
                                label="Năm xuất bản"
                                required
                            >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item<FieldType>
                        name="document_content"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="store_Id"
                        label="Chọn kho tài liệu"
                        required
                    >
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Chọn kho tài liệu"
                            options={optionStore}
                        />
                    </Form.Item>
                    {
                        !documentId &&
                        <>
                            <Form.Item<FieldType>
                                name="format_Id"
                                label="Chọn định dạng file"
                                required
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn định dạng file"
                                    options={optionFormat}
                                    onChange={handleChangeOption}
                                />
                            </Form.Item>
                            <Form.Item
                                name="files"
                                label="Chọn file"
                                required
                            >
                                <Upload
                                    listType="text"
                                    maxCount={1}
                                    fileList={fileList}
                                    beforeUpload={handleBeforeUpload}
                                    accept={acceptFile}
                                    onRemove={() => setFileList([])}
                                    onChange={handleChange}
                                >
                                    {
                                        fileList.length === 0 &&
                                        <Button icon={<UploadOutlined />}>
                                            Chọn file theo loại
                                        </Button>
                                    }
                                </Upload>
                            </Form.Item>
                        </>
                    }
                    <Form.Item<FieldType>
                        name="document_score"
                        label="Số điểm"
                    >
                        <InputNumber min={0} addonAfter={<DollarOutlined />} />
                    </Form.Item>
                </Modal>
            </Form>
            <Modal
                title="Thông tin tài liệu"
                open={isModalInfo}
                onOk={() => setIsModalInfo(false)}
                onCancel={() => setIsModalInfo(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalInfo(false)}>
                        Thoát
                    </Button>
                ]}
            >
                {
                    documentInfo &&
                    <>
                        <SubTitle>{documentInfo.document_title}</SubTitle>
                        {
                            <ViewURL
                                format={documentInfo.format.format_name as string}
                                url={convertUrl(documentInfo.document_url)}
                            />
                        }
                        <Description>
                            <TitleContent>Mô tả: </TitleContent>
                            <Typography.Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}>
                                {documentInfo.document_content}
                            </Typography.Paragraph>
                        </Description>
                        <TitleContent>
                            Thông tin cơ bản:
                        </TitleContent>
                        <List
                            header={null}
                            footer={null}
                            bordered
                            dataSource={listText}
                            renderItem={(item) => (
                                <List.Item key={item.title} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography.Text code>[{item.title}]</Typography.Text> {item.text}
                                </List.Item>
                            )}
                        />
                    </>
                }
            </Modal>
        </>
    )
}

export default ManagerDocument