import { CheckCircleOutlined, CheckSquareOutlined, ExclamationCircleFilled, EyeOutlined, FilterOutlined, FolderOutlined, OrderedListOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { Button, Flex, Input, Select, Typography, Modal, Pagination, Form, Tooltip, FormProps } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Question from "~/components/question";
import { useGlobalDataContext } from "~/hooks/globalData";
import AccountAPI from "~/services/actions/account";
import QuestionAPI, { QuestionParams } from "~/services/actions/question";
import TypeAPI from "~/services/actions/type";
import { BoxTitle } from "~/services/constants/styled"
import { Option } from "~/services/types/dataType";
import { QuestionInfo, Question as QuestionType } from "~/services/types/question";
import ButtonDelete from "~/services/utils/buttonDelete";
import ButtonEdit from "~/services/utils/buttonEdit";
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import { accountInfoSelector } from "~/services/reducers/selectors";
import { PATH } from "~/services/constants/navbarList";

type FieldType = {
    question_content?: string
    type_Id?: string
};

const Box = styled.div`
    display: flex;
    gap: 10px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 15px;

    &>div {
        flex: 1;
    }
`

const Icon = styled.span`
    font-size: 40px;
`

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
`

const ManagerQuestion = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idQuestion, setIdQuestion] = useState<string | undefined>()
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [optionType, setOptionType] = useState<Option[]>()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const dispatch = useDispatch();
    const account = useSelector(accountInfoSelector)
    const [accountId, setAccountId] = useState<string>()
    const [form] = Form.useForm<FieldType>();
    const title = 'Danh sách câu hỏi'
    const [listQuestions, setListQuestions] = useState<QuestionInfo[]>([])
    const [questionInfo, setQuestionInfo] = useState<QuestionInfo | undefined>()
    const [searchValue, setSearchValue] = useState<string | undefined>()
    const location = useLocation();
    const checkAuth = location.pathname.includes(PATH.AUTH);

    useEffect(() => {
        document.title = title
        getAllType()
        getAllQuestion({})
        if (account?.account_Id) {
            setAccountId(account.account_Id)
        } else {
            getInfo()
        }
    }, [])

    const getOneQuestion = async (id: string) => {
        try {
            setIsLoading(true)
            const { data, status } = await QuestionAPI.getOne(id)
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                setQuestionInfo(data)
                form.setFieldsValue({
                    question_content: data.question_content,
                    type_Id: data.type_Id
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

    const getInfo = async () => {
        try {
            setIsLoading(true)
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setAccountId(data.account_Id)
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const getAllQuestion = async (params: QuestionParams) => {
        setIsLoading(true)
        try {
            const allParams = { ...params }
            if (checkAuth) {
                if (accountId) {
                    allParams.id = accountId
                }
            }
            const { data, message, status } = await QuestionAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setListQuestions(data.questions)
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

    const getAllType = async () => {
        setIsLoading(true)
        try {
            const { data, message, status } = await TypeAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                const result: Option[] = data.types.map((type) => ({
                    label: type.type_name,
                    value: type.type_Id as string
                }))
                setOptionType(result)
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

    const handleChange = (value: string) => {
        setSearchValue(value)
    };

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
            const data: QuestionType = {
                question_content: values.question_content as string,
                type_Id: values.type_Id as string,
                auth_Id: accountId as string,
                question_Id: idQuestion
            }
            if (!idQuestion) {
                const res = await QuestionAPI.create(data)
                status = res.status
                message = res.message as string
                form.resetFields()
            } else {
                const res = await QuestionAPI.update(data)
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
            if (status === 200) await getAllQuestion({})
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

    const filterQuestion = async () => {
        if (searchValue) {
            await getAllQuestion({ type: searchValue })
        }
    }

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Flex
                align='center'
                justify='flex-end'
                gap={10}
                style={{ marginBottom: '15px' }}
            >
                <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={optionType}
                    value={searchValue}
                    placeholder="Chọn loại"
                />
                <Button
                    type="primary"
                    onClick={filterQuestion}
                >
                    <FilterOutlined />
                </Button>
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={() => showModal()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <div>
                {
                    listQuestions?.map((question) => (
                        <Box key={question.question_Id}>
                            <Icon>
                                <QuestionCircleOutlined />
                            </Icon>
                            <div>
                                <Typography.Paragraph
                                    ellipsis={{ rows: 2, expandable: true, symbol: 'xem thêm' }}
                                    style={{ marginBottom: '0' }}
                                >
                                    {question.question_content}
                                </Typography.Paragraph>
                                <Flex justify="space-between" gap={20} style={{ paddingTop: '10px' }}>
                                    <Tooltip placement="top" title={"Chọn 1"}>
                                        <span style={{ fontSize: 20, color: '#4cd137' }}>
                                            {
                                                question.type.type_name.toLocaleLowerCase().indexOf('one') !== -1 ?
                                                    <CheckCircleOutlined /> :
                                                    <CheckSquareOutlined />
                                            }
                                        </span>
                                    </Tooltip>
                                    <Flex justify="flex-end" gap={10}>
                                        <Button type="primary" onClick={() => showModalDetail(question.question_Id as string)}>
                                            <EyeOutlined />
                                        </Button>
                                        <WrapperBtn onClick={() => showModal(question.question_Id)}>
                                            <ButtonEdit />
                                        </WrapperBtn>
                                        <WrapperBtn onClick={() => showPromiseConfirm(question.question_Id as string)}>
                                            <ButtonDelete />
                                        </WrapperBtn>
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: '#4834d4' }}
                                        >
                                            <Link to={`${PATH.QUESTION_RESOURCE.replace(':id', question.question_Id as string)}`}>
                                                <FolderOutlined />
                                            </Link>
                                        </Button>
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: '#4834d4' }}
                                        >
                                            <Link to={`${PATH.MANAGER_OPTION.replace(':id', question.question_Id as string)}`}>
                                                <OrderedListOutlined />
                                            </Link>
                                        </Button>
                                    </Flex>
                                </Flex>
                            </div>
                        </Box>
                    ))
                }
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
                            name="type_Id"
                            label="Chọn loại"
                            rules={[{
                                required: true,
                                message: 'Vui lòng chọn loại!',
                            }]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Chọn loại"
                                options={optionType}
                            />
                        </Form.Item>
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
                <Flex
                    align='center'
                    justify='center'
                    style={{ marginTop: '15px' }}
                >
                    <Pagination defaultCurrent={1} total={50} />
                </Flex>
            </div>
        </>
    )
}

export default ManagerQuestion