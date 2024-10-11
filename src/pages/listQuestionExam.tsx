import { ExclamationCircleFilled, EyeOutlined, FilterOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Flex, Form, FormProps, Input, Modal, Select, Table, TableProps } from "antd"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import Question from "~/components/question"
import { useGlobalDataContext } from "~/hooks/globalData"
import QuestionAPI, { QuestionParams } from "~/services/actions/question"
import TypeAPI from "~/services/actions/type"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"
import { Option } from "~/services/types/dataType"
import { QuestionInfo } from "~/services/types/question"
import ButtonBack from "~/services/utils/buttonBack"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"

type FieldType = {
    type?: string;
    title?: string;
};

interface DataType {
    key: string;
    content: string;
    type: string;
    score?: number;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
`

const ListQuestionExam = ({ isAdd }: { isAdd?: boolean }) => {
    const [title, setTitle] = useState('Danh sách câu hỏi của bài thi')
    const [optionType, setOptionType] = useState<Option[]>()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [questionInfo, setQuestionInfo] = useState<QuestionInfo | undefined>()
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [listQuestions, setListQuestions] = useState<string[]>([])
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (isAdd) {
            setTitle('Thêm câu hỏi vào bài thi')
        }
        document.title = title
        if (id) {
            if (isAdd) getAllQuestion({ page: 1 })
        } else navigate(-1)
        getAllType()
    }, [title, isAdd])

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

    const getAllQuestion = async (params: QuestionParams) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await QuestionAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.questions.map((question) => {
                        const result: DataType = {
                            key: question.question_Id as string,
                            content: question.question_content,
                            type: question.type.type_name
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

    const getOneQuestion = async (id: string) => {
        try {
            setIsLoading(true)
            const { data, status } = await QuestionAPI.getOne(id)
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                setQuestionInfo(data)
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const showModalDetail = async (id: string) => {
        if (id) {
            await getOneQuestion(id)
        }
        setIsModalDetailOpen(true);
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            width: '40%'
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: '15%'
        },
        !isAdd ? {
            title: 'Điểm',
            dataIndex: 'score',
            key: 'score',
        } : {},
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
                    {
                        !isAdd &&
                        <>
                            <WrapperBtn>
                                <ButtonEdit />
                            </WrapperBtn>
                            <WrapperBtn onClick={() => showPromiseConfirm(record.key)}>
                                <ButtonDelete />
                            </WrapperBtn>
                        </>
                    }
                    {
                        isAdd &&
                        <input
                            type="checkbox"
                            onChange={handleChangeCheckbox}
                            value={record.key}
                            checked={checkInput(record.key) || false}
                        />
                    }
                </Flex>
            ),
        },
    ];

    const checkInput = (id: string) => {
        return listQuestions.includes(id)
    }

    const handleChangeCheckbox = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setListQuestions((prev) => [...prev, e.target.value])
        } else {
            const questions = listQuestions
                .filter(
                    (question) => question !== e.target.value
                )
            setListQuestions(questions)
        }
    }

    const showPromiseConfirm = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa câu hỏi này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {

            },
            onCancel() { },
        });
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (isAdd) {
            await getAllQuestion({
                page: 1,
                title: values.title,
                type: values.type
            })
        }
    }

    const handleAddQuestion = async () => {
        if (isAdd) {
            console.log(listQuestions)
        }
    }

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex
                justify="space-between"
                gap={10}
                style={{
                    paddingBottom: 10
                }}
            >
                <ButtonBack />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={handleAddQuestion}
                >
                    {
                        isAdd ?
                            <SaveOutlined /> :
                            <Link to={`${PATH.ADD_QUESTION.replace(':id', id as string)}`}>
                                <PlusOutlined />
                            </Link>
                    }
                </Button>
            </Flex>
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
                        <Input placeholder='Tên khóa học...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="type"
                        style={{ marginBottom: 0, width: '20%' }}
                    >
                        <Select
                            options={optionType}
                            placeholder="Chọn loại"
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
        </>
    )
}

export default ListQuestionExam