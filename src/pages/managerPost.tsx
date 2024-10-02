import { EyeOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Input, Modal, Select, Table, TableProps } from "antd";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import PostAPI, { ParamsAll } from "~/services/actions/post";
import StatusAPI from "~/services/actions/status";
import SubjectAPI from "~/services/actions/subject";
import { PATH } from "~/services/constants/navbarList";
import { Title } from "~/services/constants/styled"
import { accountInfoSelector } from "~/services/reducers/selectors";
import { Option } from "~/services/types/dataType";
import ButtonEdit from "~/services/utils/buttonEdit";
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom";

type FieldType = {
    subject?: string;
    title?: string;
    status?: string;
};

interface DataType {
    key: string;
    name: string;
    subject: string;
    auth: string;
    status: string;
}

const ManagerPost = ({ isUser }: { isUser?: boolean }) => {
    const title = 'Danh sách bài đăng'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [subjectOptions, setSubjectOptions] = useState<Option[]>([])
    const [statusOptions, setStatusOptions] = useState<Option[]>([])
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [idQuestion, setIdQuestion] = useState<string>('')
    const [optionStatus, setOptionStatus] = useState<string | undefined>()
    const info = useSelector(accountInfoSelector)
    const navigate = useNavigate();
    const location = useLocation();
    const checkAuth = location.pathname.includes(PATH.AUTH);

    useEffect(() => {
        document.title = title
        getAllSubject()
        getAllStatus()
        getAllPost({ page: 1 })
    }, [])

    const getAllSubject = async () => {
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                setSubjectOptions(
                    data.subjects.map((subject) => {
                        const result: Option = {
                            value: subject.subject_Id as string,
                            label: subject.subject_name
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

    const getAllStatus = async () => {
        setIsLoading(true)
        try {
            const { status, data, message } = await StatusAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                setStatusOptions(
                    data.status.map((item) => {
                        const result: Option = {
                            value: item.status_Id as string,
                            label: item.status_name
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

    const getOnePost = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await PostAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setOptionStatus(data.status.status_name)
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
        await getAllPost({
            page: 1,
            status: values.status,
            subject: values.subject,
            title: values.title
        })
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tên bài đăng',
            dataIndex: 'name',
            key: 'name',
            width: '40%'
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Tác giả',
            dataIndex: 'auth',
            key: 'auth',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Flex
                    align='center'
                    justify='flex-start'
                    gap={10}
                    wrap='wrap'
                >
                    <ButtonLinkCustom
                        href=""
                        shape="default"
                    >
                        <EyeOutlined />
                    </ButtonLinkCustom>
                    {
                        !isUser &&
                        <>
                            <div onClick={() => handleShowModel(record.key)}>
                                <ButtonEdit />
                            </div>
                        </>
                    }
                </Flex>
            ),
        },
    ];

    const handleShowModel = async (id: string) => {
        setIdQuestion(id)
        await getOnePost(id)
        setIsOpenModal(true)
    }

    const getAllPost = async (params: ParamsAll) => {
        setIsLoading(true)
        try {
            const allParams = { ...params }
            if (checkAuth) {
                if (info) {
                    allParams.auth = info.account_Id
                } else {
                    navigate(PATH.LOGIN)
                }
            }
            const { data, status, message } = await PostAPI.getAll(allParams)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.posts.map((post) => {
                        const result: DataType = {
                            key: post.post_Id as string,
                            auth: post.auth.profile.profile_name,
                            name: post.post_title,
                            status: post.status.status_name,
                            subject: post.subject.subject_name
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

    const handleChangeStatus = async () => {
        if (idQuestion && optionStatus) {
            setIsLoading(true)
            try {
                const { status, message } = await PostAPI.updateStatus(
                    idQuestion,
                    optionStatus
                )
                if (status === 200) {
                    await getAllPost({ page: 1 })
                }
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
        setIsOpenModal(false)
    }

    const handleChange = (value: string) => {
        setOptionStatus(value)
    };

    return (
        <>
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
                        name="title"
                        style={{
                            marginBottom: 0,
                            flex: 1
                        }}
                    >
                        <Input placeholder='Tên bài đăng...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="subject"
                        style={{ marginBottom: 0, width: '30%' }}
                    >
                        <Select
                            options={subjectOptions}
                            placeholder="Chọn môn học"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="status"
                        style={{ marginBottom: 0, width: '15%' }}
                    >
                        <Select
                            options={statusOptions}
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
            <Table columns={columns} dataSource={dataTable} />
            <Modal
                title="Cập nhật trạng thái"
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                onOk={handleChangeStatus}
                cancelText="Thoát"
            >
                <Select
                    options={statusOptions}
                    value={optionStatus}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                />
            </Modal>
        </>
    )
}

export default ManagerPost