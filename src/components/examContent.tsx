import { CountdownProps, Flex, Pagination, Statistic } from "antd"
import styled from "styled-components"
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

const ExamContent = ({ data }: { data: ExamInfo }) => {

    const onFinish: CountdownProps['onFinish'] = () => {
        console.log('finished!');
    };

    const deadline = (time: number) => Date.now() + 1000 * 60 * 60 * time;

    return (
        <>
            <Content>
                <SubTitle>{data.exam_title}</SubTitle>
                <p>
                    {data.exam_description}
                </p>
                <Flex
                    gap={10}
                    style={{
                        paddingTop: '10px',
                        fontWeight: 500
                    }}
                >
                    <span>Thời gian: {data.exam_limit} phút</span>
                    <span>Điểm: {data.exam_total_score}</span>
                </Flex>
                <span style={{ display: 'block', paddingBlock: '10px' }}></span>
                {/* <Question /> */}
                <Flex align='center' justify='center'>
                    <Pagination defaultCurrent={1} total={50} />
                </Flex>
                {
                    data.exam_limit &&
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