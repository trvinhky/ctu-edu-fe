import { CountdownProps, Flex, Pagination, Statistic } from "antd"
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components"
import Question from "~/components/question"
import { useGlobalDataContext } from "~/hooks/globalData";
import ExamAPI from "~/services/actions/exam";
import { convertDate, DATEFORMAT_FULL } from "~/services/constants";
import { ExamInfo } from "~/services/types/exam";

const { Countdown } = Statistic;

const SubTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
`

const Content = styled.div`
    padding-bottom: 15px;
`

const Box = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 999;
`

const ExamContent = () => {
    const [searchParams] = useSearchParams();
    const searchId = searchParams.get('exam');
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [examInfo, setExamInfo] = useState<ExamInfo>()
    const navigate = useNavigate()

    useEffect(() => {
        if (searchId) {
            getOneExam(searchId)
        } else navigate(-1)
    }, [searchId])

    const onFinish: CountdownProps['onFinish'] = () => {
        console.log('finished!');
    };

    const deadline = (time: number) => Date.now() + 1000 * 60 * 60 * time;

    const getOneExam = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await ExamAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setExamInfo(data)
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

    return (
        <>
            {
                examInfo &&
                <Content>
                    <SubTitle>{examInfo.exam_title}</SubTitle>
                    <p>
                        {examInfo.exam_description}
                    </p>
                    <Flex
                        gap={10}
                        style={{
                            paddingTop: '10px',
                            fontWeight: 500
                        }}
                    >
                        {
                            examInfo.exam_start_time &&
                            <span>{convertDate(examInfo.exam_start_time.toString(), DATEFORMAT_FULL)}</span>
                        }
                        <span>Thời gian: {examInfo.exam_limit} phút</span>
                        <span>Điểm: {examInfo.exam_total_score}</span>
                    </Flex>
                    <span style={{ display: 'block', paddingBlock: '10px' }}></span>
                    {/* <Question /> */}
                    <Flex align='center' justify='center'>
                        <Pagination defaultCurrent={1} total={50} />
                    </Flex>
                    {
                        examInfo.exam_limit &&
                        <Box>
                            <Countdown
                                title="Thời gian"
                                value={deadline(examInfo.exam_limit)}
                                onFinish={onFinish} />
                        </Box>
                    }
                </Content>
            }
        </>
    )
}

export default ExamContent