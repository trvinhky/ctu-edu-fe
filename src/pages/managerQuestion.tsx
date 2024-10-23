import { ExclamationCircleFilled, EyeOutlined, OrderedListOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Input, Select, Modal, Form, FormProps, TableProps, Table } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Question from "~/components/question";
import { useGlobalDataContext } from "~/hooks/globalData";
import QuestionAPI, { QuestionParams } from "~/services/actions/question";
import { Title } from "~/services/constants/styled"
import { Option } from "~/services/types/dataType";
import { QuestionInfo } from "~/services/types/question";
import ButtonDelete from "~/services/utils/buttonDelete";
import ButtonEdit from "~/services/utils/buttonEdit";
import { accountInfoSelector } from "~/services/reducers/selectors";
import { PATH } from "~/services/constants/navbarList";
import CategoryAPI from "~/services/actions/category";
import { CategoryInfo } from "~/services/types/category";

type FieldType = {
    question_content?: string
    category_Id?: string
};

interface DataType {
    key: string;
    content: string;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
`

const ManagerQuestion = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idQuestion, setIdQuestion] = useState<string | undefined>()
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [optionCategory, setOptionCategory] = useState<Option[]>()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const account = useSelector(accountInfoSelector)
    const [accountId, setAccountId] = useState<string>()
    const [form] = Form.useForm<FieldType>();
    const title = 'Danh sách câu hỏi'
    const [questionInfo, setQuestionInfo] = useState<QuestionInfo | undefined>()
    const location = useLocation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const checkAuth = location.pathname.includes(PATH.AUTH);
    const [acceptFile, setAcceptFile] = useState<string | undefined>()
    const [categories, setCategories] = useState<CategoryInfo[]>()
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllQuestion({
            page: pagination.current,
            limit: pagination.pageSize
        })
        getAllCategory()
        if (account?.account_Id) {
            setAccountId(account.account_Id)
        } else if (checkAuth) {
            navigate(PATH.LOGIN)
        } else navigate(PATH.LOGIN_ADMIN)
    }, [pagination.current, pagination.pageSize])

    const getOneQuestion = async (id: string) => {
        try {
            setIsLoading(true)
            const { data, status } = await QuestionAPI.getOne(id)
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                setQuestionInfo(data)
                form.setFieldsValue({
                    question_content: data.question_content
                })
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            width: '40%'
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
                    <Button type="primary" onClick={() => showModalDetail(record.key)}>
                        <EyeOutlined />
                    </Button>
                    <WrapperBtn onClick={() => showModal(record.key)}>
                        <ButtonEdit />
                    </WrapperBtn>
                    <Button type="primary" style={{ background: '#16a085' }}>
                        <Link to={PATH.MANAGER_OPTION.replace(':id', record.key)}>
                            <OrderedListOutlined />
                        </Link>
                    </Button>
                    <WrapperBtn onClick={() => showPromiseConfirm(record.key)}>
                        <ButtonDelete />
                    </WrapperBtn>
                </Flex>
            ),
        },
    ];

    const getAllQuestion = async (params: QuestionParams) => {
        setIsLoading(true)
        try {
            const allParams = { ...params }
            if (checkAuth) {
                if (accountId) {
                    allParams.id = accountId
                }
            }
            const { data, message, status } = await QuestionAPI.getAll(allParams)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.questions.map((question) => {
                        const result: DataType = {
                            key: question.question_Id as string,
                            content: question.question_content
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

    const showModal = async (id?: string) => {
        setIdQuestion(id)
        if (id) {
            await getOneQuestion(id)
        } else {
            form.resetFields()
        }
        setIsModalOpen(true);
    };

    const showModalDetail = async (id: string) => {
        if (id) {
            await getOneQuestion(id)
        }
        setIsModalDetailOpen(true);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''
            const data = new FormData()
            data.append('question_content', values.question_content as string)
            data.append('auth_Id', accountId as string)

            if (selectedFile && values.category_Id) {
                data.append('file', selectedFile)
                data.append('category_Id', values.category_Id as string)
            }

            if (!idQuestion) {
                const res = await QuestionAPI.create(data)
                status = res.status
                message = res.message as string
                form.resetFields()
            } else {
                const res = await QuestionAPI.update(idQuestion, data)
                status = res.status
                message = res.message as string
            }

            await getAllQuestion({})

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

    const confirmDelete = async (id: string) => {
        setIsLoading(true)
        try {
            const { message, status } = await QuestionAPI.delete(id)
            if (status === 200) await getAllQuestion({
                page: pagination.current,
                limit: pagination.pageSize
            })
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

    const showPromiseConfirm = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa câu hỏi này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(id)
            },
            onCancel() { },
        });
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file)
        }
    };

    const handleChangeOption = (value: string) => {
        const data = categories?.find((category) => category.category_Id === value)
        setAcceptFile(data?.category_accept)
    };

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <>
            <Title>{title}</Title>
            <Flex
                align='center'
                justify='flex-end'
                gap={10}
                style={{ marginBottom: '15px' }}
            >
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={() => showModal()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <div>
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowKey="key"
                />
                <Form
                    autoComplete="off"
                    layout="vertical"
                    initialValues={{}}
                    onFinish={onFinish}
                    name="question_action"
                    form={form}
                >
                    <Modal
                        title={`${idQuestion ? 'Cập nhật' : 'Thêm mới'} câu hỏi`}
                        open={isModalOpen}
                        onOk={() => setIsModalOpen(false)}
                        onCancel={() => setIsModalOpen(false)}
                        footer={[
                            <Button key="back" onClick={() => setIsModalOpen(false)}>
                                Hủy
                            </Button>,
                            <WrapperBtn
                                style={{ paddingLeft: '10px' }}
                                key="btn"
                                onClick={() => setIsModalOpen(false)}
                            >
                                {
                                    idQuestion ?
                                        <ButtonEdit text="Cập nhật" htmlType="submit" form="question_action" /> :
                                        <Button type="primary" htmlType="submit" form="question_action">
                                            Thêm
                                        </Button>
                                }
                            </WrapperBtn>
                        ]}
                    >
                        <Form.Item<FieldType>
                            name="question_content"
                            label="Nội dung"
                            rules={[{
                                required: true,
                                message: 'Vui lòng nhập nội dung!',
                            }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        {
                            !idQuestion &&
                            <>
                                <Form.Item<FieldType>
                                    name="category_Id"
                                    label="Chọn loại file"
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Chọn loại file"
                                        options={optionCategory}
                                        onChange={handleChangeOption}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Chọn file"
                                    name="resource_url"
                                >
                                    <Input
                                        type="file"
                                        onChange={handleUpload}
                                        accept={acceptFile}
                                    />
                                </Form.Item>
                            </>
                        }
                    </Modal>
                </Form>
                <Modal
                    title="Chi tiết câu hỏi"
                    open={isModalDetailOpen}
                    onOk={() => setIsModalDetailOpen(false)}
                    onCancel={() => setIsModalDetailOpen(false)}
                    footer={[
                        <Button
                            type="primary"
                            key="detail"
                            onClick={() => setIsModalDetailOpen(false)}
                        >
                            Ok
                        </Button>
                    ]}
                >
                    {questionInfo && <Question questionInfo={questionInfo} />}
                </Modal>
            </div>
        </>
    )
}

export default ManagerQuestion