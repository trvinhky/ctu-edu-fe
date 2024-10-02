import { ExclamationCircleFilled, FolderOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, FormProps, Input, Modal, Table, TableProps } from "antd"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { useGlobalDataContext } from "~/hooks/globalData"
import LessonAPI from "~/services/actions/lesson"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"
import ButtonBack from "~/services/utils/buttonBack"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"

type FieldType = {
    lesson_title?: string
    lesson_content?: string
};

interface DataType {
    key: string;
    title: string;
    content: string;
    resources: number;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
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

    useEffect(() => {
        document.title = title
        if (id) {
            getAllLesson(id, 1)
        } else navigate(-1)
    }, [id])

    const getOneLesson = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await LessonAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                form.setFieldsValue({
                    lesson_content: data.lesson_content,
                    lesson_title: data.lesson_title
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

    const getAllLesson = async (id: string, page?: number) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await LessonAPI.getAll(id, page)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.lessons?.map((lesson) => {
                        const result: DataType = {
                            key: lesson.lesson_Id as string,
                            content: lesson.lesson_content ?? 'Không',
                            title: lesson.lesson_title,
                            resources: lesson.resources?.length ?? 0
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''
            if (lessonId) {
                const res = await LessonAPI.update({
                    course_Id: id as string,
                    lesson_title: values.lesson_title as string,
                    lesson_content: values.lesson_content
                })
                status = res.status
                message = res.message as string
            } else {
                const res = await LessonAPI.create({
                    course_Id: id as string,
                    lesson_title: values.lesson_title as string,
                    lesson_content: values.lesson_content
                })
                status = res.status
                message = res.message as string
                form.resetFields()
            }
            if (status === 200) {
                await getAllLesson(id as string, 1)
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
        },
        {
            title: 'Mô tả',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Tài liệu',
            dataIndex: 'resources',
            key: 'resources',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Flex gap={10}>
                    <div
                        onClick={() => showModal(record.key)}
                    >
                        <ButtonEdit />
                    </div>
                    <div onClick={() => showPromiseConfirm(record.key)}>
                        <ButtonDelete />
                    </div>
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#4834d4' }}
                    >
                        <Link to={`${PATH.LESSON_RESOURCE.replace(':id', record.key as string)}`}>
                            <FolderOutlined />
                        </Link>
                    </Button>
                </Flex>
            ),
        }
    ];

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
            if (status === 200) await getAllLesson(id as string)
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
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(idTarget)
            },
            onCancel() { },
        });
    };

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
                </Modal>
            </Form>
        </>
    )
}

export default ManagerLesson