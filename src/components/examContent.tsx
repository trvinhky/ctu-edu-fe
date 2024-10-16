import { FieldTimeOutlined, SendOutlined } from "@ant-design/icons";
import { Button, CountdownProps, Flex, Pagination, Popconfirm, PopconfirmProps, Statistic } from "antd"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"
import Question from "~/components/question";
import { useGlobalDataContext } from "~/hooks/globalData";
import QuestionExamAPI, { QuestionExamParams } from "~/services/actions/question_exam";
import { answersSelector } from "~/services/reducers/selectors";
import { ExamInfo } from "~/services/types/exam";
import { QuestionInfo } from "~/services/types/question";

const { Countdown } = Statistic;

const Content = styled.div`
    padding-bottom: 15px;
`

const Box = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 999;
`

const ExamContent = ({ data }: { data: ExamInfo }) => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [startExam, setStartExam] = useState(false)
    const [listQuestion, setListQuestion] = useState<QuestionInfo[]>()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });
    const answers = useSelector(answersSelector)

    useEffect(() => {
        if (data.exam_Id) {
            getAllQuestionExam({
                exam: data.exam_Id,
                page: pagination.current,
                limit: pagination.pageSize
            })
        }
    }, [data, pagination.current, pagination.pageSize])

    const onFinish: CountdownProps['onFinish'] = () => {
        console.log('finished!');
    };

    const deadline = (time: number) => Date.now() + 1000 * 60 * 60 * time;

    const getAllQuestionExam = async (params: QuestionExamParams) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await QuestionExamAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setPagination((prev) => ({
                    ...prev,
                    total: data.count
                }))
                const questions = data.questionExams.map((item) => item.question)
                setListQuestion(questions)
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

    const handleStartExam: PopconfirmProps['onConfirm'] = () => {
        setStartExam(true)
    }

    const handlePageChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const handleEndExam: PopconfirmProps['onConfirm'] = () => {
        console.log(answers)
        setStartExam(false)
    }

    return (
        <>
            <Content>
                <p>
                    {data.exam_description}
                </p>
                <Flex
                    gap={10}
                    style={{
                        paddingTop: '10px',
                        fontWeight: 500
                    }}
                    justify="space-between"
                >
                    <span>Thời gian: {data.exam_limit} phút</span>
                    {
                        startExam ?
                            <Popconfirm
                                title="Bài thi"
                                description="Bạn có chắc muốn nộp bài thi?"
                                onConfirm={handleEndExam}
                                okText="OK"
                                cancelText="Không"
                            >
                                <Button type="primary">
                                    Nộp bài <SendOutlined />
                                </Button>
                            </Popconfirm> :
                            <Popconfirm
                                title="Bài thi"
                                description="Bạn có chắc muốn bắt đầu thi?"
                                onConfirm={handleStartExam}
                                okText="OK"
                                cancelText="Không"
                            >
                                <Button type="primary">
                                    <FieldTimeOutlined /> Bắt đầu thi
                                </Button>
                            </Popconfirm>
                    }
                </Flex>
                <span style={{ display: 'block', paddingBlock: '10px' }}></span>
                {
                    listQuestion?.map((question) => (
                        <Question questionInfo={question} key={question.question_Id} />
                    ))
                }
                <Flex align='center' justify='center'>
                    <Pagination
                        total={pagination.total}
                        pageSize={pagination.pageSize}
                        current={pagination.current}
                        onChange={handlePageChange}
                    />
                </Flex>
                {
                    data.exam_limit && startExam &&
                    <Box>
                        <Countdown
                            title="Thời gian"
                            value={deadline(data.exam_limit)}
                            onFinish={onFinish} />
                    </Box>
                }
            </Content>
        </>
    )
}

export default ExamContent