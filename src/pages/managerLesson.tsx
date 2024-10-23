import { DollarOutlined, ExclamationCircleFilled, ExclamationCircleOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Flex, Form, FormProps, Input, InputNumber, Modal, Select, Table, TableProps, Tag, Upload, UploadFile } from "antd"
import { RcFile, UploadProps } from "antd/es/upload"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import ViewURL from "~/components/viewURL"
import { useGlobalDataContext } from "~/hooks/globalData"
import CategoryAPI from "~/services/actions/category"
import LessonAPI from "~/services/actions/lesson"
import { convertUrl } from "~/services/constants"
import { BoxTitle } from "~/services/constants/styled"
import { CategoryInfo } from "~/services/types/category"
import { Option } from "~/services/types/dataType"
import { LessonInfo } from "~/services/types/lesson"
import ButtonBack from "~/services/utils/buttonBack"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"

type FieldType = {
    lesson_title?: string
    lesson_content?: string
    lesson_score?: number
    category_Id?: string
};

interface DataType {
    key: string;
    title: string;
    content: string;
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

const ManagerLesson = () => {
    const title = 'Danh sách bài học'
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm<FieldType>();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [lessonId, setLessonId] = useState<string | undefined>()
    const [optionCategory, setOptionCategory] = useState<Option[]>()
    const [categories, setCategories] = useState<CategoryInfo[]>()
    const [acceptFile, setAcceptFile] = useState<string | undefined>()
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [isModalInfo, setIsModalInfo] = useState(false)
    const [lessonInfo, setLessonInfo] = useState<LessonInfo>()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllCategory()
        if (id) {
            getAllLesson(id, pagination.current, pagination.pageSize)
        } else navigate(-1)
    }, [id, pagination.current, pagination.pageSize])

    const getAllCategory = async () => {
        setIsLoading(true)
        try {
            const { data, message, status } = await CategoryAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                const result: Option[] = data.categories.map((category) => ({
                    label: category.category_description,
                    value: category.category_Id as string
                }))
                setOptionCategory(result)
                setCategories(data.categories)
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

    const getOneLesson = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await LessonAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                form.setFieldsValue({
                    lesson_content: data.lesson_content,
                    lesson_title: data.lesson_title,
                    lesson_score: data.lesson_score
                })
                setLessonInfo(data)
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

    const getAllLesson = async (id: string, page?: number, limit?: number) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await LessonAPI.getAll({ id, page, limit })
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.lessons?.map((lesson) => {
                        const result: DataType = {
                            key: lesson.lesson_Id as string,
                            content: lesson.lesson_content ?? 'Không',
                            title: lesson.lesson_title,
                            score: lesson.lesson_score ?? 0
                        }

                        return result
                    })
                )

                setPagination({
                    current: page ?? 1,
                    pageSize: limit ?? 6,
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''

            const data = new FormData()
            data.append('lesson_title', values.lesson_title as string)
            data.append('lesson_content', values.lesson_content as string)
            data.append('course_Id', id as string)
            data.append('lesson_score', values.lesson_score?.toString() ?? '0')
            data.append('category_Id', values.category_Id as string)
            if (fileList.length > 0) {
                const file = fileList[0].originFileObj as File;
                data.append("file", file);
            }

            if (lessonId) {
                data.append('lesson_Id', lessonId as string)
                const res = await LessonAPI.update(
                    lessonId,
                    data
                )
                status = res.status
                message = res.message as string
            } else {
                const res = await LessonAPI.create(data)
                status = res.status
                message = res.message as string
                setFileList([])
                form.resetFields()
            }
            if (status === 200) {
                await getAllLesson(
                    id as string,
                    pagination.current,
                    pagination.pageSize
                )
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
            width: '35%'
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
        await getOneLesson(id)
        setIsModalInfo(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        if (form.getFieldValue('lesson_title'))
            setIsModalOpen(false);
    };

    const showModal = async (id?: string) => {
        if (id) {
            setLessonId(id)
            await getOneLesson(id)
        } else {
            form.resetFields()
            setLessonId(undefined)
        }
        setIsModalOpen(true);
    };

    const confirmDelete = async (idTarget: string) => {
        setIsLoading(true)
        try {
            const { message, status } = await LessonAPI.delete(idTarget)
            if (status === 200) await getAllLesson(
                id as string,
                pagination.current,
                pagination.pageSize
            )
            messageApi.open({
                type: status === 200 ? 'success' : 'error',
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

    const showPromiseConfirm = (idTarget: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa bài học này?',
            icon: <ExclamationCircleFilled />,
            content: <Tag icon={<ExclamationCircleOutlined />} color="error">
                Lưu ý: Chỉ xóa được khi bài học này chưa được mua.
            </Tag>,
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(idTarget)
            },
            onCancel() { },
        });
    };

    const handleChangeOption = (value: string) => {
        const data = categories?.find((category) => category.category_Id === value)
        setAcceptFile(data?.category_accept)
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
            <BoxTitle>
                {title}
            </BoxTitle>
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
                name="lesson"
                form={form}
                onFinish={onFinish}
            >
                <Modal
                    title={`${lessonId ? 'Cập nhật' : 'Thêm'} bài học`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <React.Fragment key="action">
                            {
                                lessonId ?
                                    <WrapperBtn onClick={handleOk}>
                                        <ButtonEdit text="Cập nhật" htmlType="submit" form="lesson" />
                                    </WrapperBtn>
                                    :
                                    <Button type="primary" onClick={handleOk} htmlType="submit" form="lesson">
                                        Thêm
                                    </Button>
                            }
                        </React.Fragment>
                    ]}
                >
                    <Form.Item<FieldType>
                        name="lesson_title"
                        label="Tiêu đề"
                        required
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="lesson_content"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    {
                        !lessonId &&
                        <>
                            <Form.Item<FieldType>
                                name="category_Id"
                                label="Chọn loại file"
                                required
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn loại file"
                                    options={optionCategory}
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
                        name="lesson_score"
                        label="Số điểm"
                    >
                        <InputNumber min={0} addonAfter={<DollarOutlined />} />
                    </Form.Item>
                </Modal>
            </Form>
            <Modal
                title="Thông tin bài học"
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
                    lessonInfo &&
                    <>
                        <SubTitle>{lessonInfo.lesson_title}</SubTitle>
                        {
                            <ViewURL
                                category={lessonInfo.category?.category_name as string}
                                url={convertUrl(lessonInfo.lesson_url)}
                            />
                        }
                        <Description>
                            <span>Mô tả: </span>
                            {lessonInfo.lesson_content}
                        </Description>
                        <Flex justify="flex-end">
                            <Tag icon={<DollarOutlined />} color="warning">
                                {lessonInfo.lesson_score === 0 ? 'free' : lessonInfo.lesson_score}
                            </Tag>
                        </Flex>
                    </>
                }
            </Modal>
        </>
    )
}

export default ManagerLesson