import { ExclamationCircleFilled, EyeOutlined, FilterOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Flex, Form, FormProps, Input, Modal, Table, TableProps } from "antd"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import Question from "~/components/question"
import { useGlobalDataContext } from "~/hooks/globalData"
import QuestionAPI, { QuestionParams } from "~/services/actions/question"
import QuestionExamAPI, { QuestionExamParams } from "~/services/actions/question_exam"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"
import { QuestionInfo } from "~/services/types/question"
import { QuestionExam } from "~/services/types/question_exam"
import ButtonBack from "~/services/utils/buttonBack"
import ButtonDelete from "~/services/utils/buttonDelete"

type FieldType = {
    title?: string;
};

interface DataType {
    key: string;
    content: string;
    score?: number;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
`

const ListQuestionExam = ({ isAdd }: { isAdd?: boolean }) => {
    const [title, setTitle] = useState('Danh sách câu hỏi của bài thi')
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [questionInfo, setQuestionInfo] = useState<QuestionInfo | undefined>()
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [listQuestions, setListQuestions] = useState<string[]>([])
    const [listQuestionsCurrent, setListQuestionsCurrent] = useState<string[]>([])
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (isAdd) {
            setTitle('Thêm câu hỏi vào bài thi')
        }
        document.title = title
        if (id) {
            if (isAdd) getAllQuestion({ page: 1 })
            getAllQuestionExam({ exam: id, page: 1 })
        } else navigate(-1)
    }, [title, isAdd])

    const getAllQuestion = async (params: QuestionParams) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await QuestionAPI.getAll(params)
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
                setListQuestions([])
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
        setIsLoading(true)
        try {
            const { data, status } = await QuestionAPI.getOne(id)
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
        setIsLoading(false)
    }

    const showModalDetail = async (id: string) => {
        if (id) {
            await getOneQuestion(id)
        }
        setIsModalDetailOpen(true);
    }

    const getAllQuestionExam = async (params: QuestionExamParams) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await QuestionExamAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                if (isAdd) {
                    setListQuestionsCurrent(data.questionExams.map((item) => {
                        const question = item.question
                        return question.question_Id as string
                    }))
                } else {
                    setDataTable(
                        data.questionExams.map((item) => {
                            const question = item.question
                            const result: DataType = {
                                key: question.question_Id as string,
                                content: question.question_content
                            }

                            return result
                        })
                    )
                }
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
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            width: '40%'
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
                        <WrapperBtn onClick={() => showPromiseConfirm(record.key)}>
                            <ButtonDelete />
                        </WrapperBtn>
                    }
                    {
                        isAdd &&
                        <input
                            type="checkbox"
                            onChange={handleChangeCheckbox}
                            value={record.key}
                            hidden={hiddenInput(record.key) || false}
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

    const hiddenInput = (id: string) => {
        return listQuestionsCurrent.includes(id)
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

    const handleDeleteQuestionExam = async (params: QuestionExam) => {
        setIsLoading(true)
        try {
            const { status, message } = await QuestionExamAPI.delete(params)
            if (status === 200) {
                await getAllQuestionExam({
                    exam: id
                })
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

    const showPromiseConfirm = (idQuestion: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa câu hỏi này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                if (id) {
                    await handleDeleteQuestionExam({
                        exam_Id: id,
                        question_Id: idQuestion
                    })
                }
            },
            onCancel() { },
        });
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (isAdd) {
            await getAllQuestion({
                page: 1,
                title: values.title
            })
        }
    }

    const addQuestionExam = async (data: QuestionExam) => {
        setIsLoading(true)
        try {
            const { status, message } = await QuestionExamAPI.create({
                exam_Id: data.exam_Id,
                question_Id: data.question_Id
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

    const handleAddQuestion = async () => {
        if (listQuestions && id) {
            if (isAdd) {
                for (let question_Id of listQuestions) {
                    await addQuestionExam({
                        question_Id,
                        exam_Id: id
                    })
                }
                setListQuestions([])
            }
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