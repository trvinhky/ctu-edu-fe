import { CountdownProps, Flex, Pagination, Statistic } from "antd"
import styled from "styled-components"
import Question from "~/components/question"

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

const ExamContent = (
    { isTime }:
        { isTime?: boolean }
) => {
    const deadline = Date.now() + 1000 * 60 * 60 * 60;

    const onFinish: CountdownProps['onFinish'] = () => {
        console.log('finished!');
    };

    return (
        <Content>
            <SubTitle>Chương 1: HTML và CSS</SubTitle>
            <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus, fugiat, reiciendis tenetur saepe distinctio quos architecto aut odit sequi fuga molestias enim itaque veritatis tempora eos nesciunt dignissimos voluptatem non!
            </p>
            <Flex
                gap={10}
                style={{
                    paddingTop: '10px',
                    fontWeight: 500
                }}
            >
                <span>07:00:00 12/09/2024</span>
                <span>Thời gian: 60 phút</span>
                <span>Điểm: 10.0</span>
            </Flex>
            <span style={{ display: 'block', paddingBlock: '10px' }}></span>
            <Question />
            <Question isMultiple={true} />
            <Question />
            <Flex align='center' justify='center'>
                <Pagination defaultCurrent={1} total={50} />
            </Flex>
            {
                !isTime &&
                <Box>
                    <Countdown title="Thời gian" value={deadline} onFinish={onFinish} />
                </Box>
            }
        </Content>
    )
}

export default ExamContent