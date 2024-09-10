import { DatabaseOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { Col, Row } from "antd"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import ExamContent from "~/components/examContent"
import LessonContent from "~/components/lessonContent"
import { BoxTitle } from "~/services/constants/styled"

const Title = styled(BoxTitle)`
    text-align: left;
`

const Tag = styled.h5`
    font-weight: 600;
    font-size: 14px;
`

const LessonTag = styled(Link)`
    display: block;
    color: #000;
    padding: 10px 6px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const Wrapper = styled.div`
    padding-bottom: 20px;
`

const ContentCourse = () => {

    useEffect(() => {
        document.title = 'Lập trình Web với ReactJS'
    }, [])

    return (
        <section>
            <Title>Lập trình Web với ReactJS</Title>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    {false ? <LessonContent /> : <ExamContent />}
                </Col>
                <Col span={8}>
                    <div>
                        <Wrapper>
                            <Tag>Bài học</Tag>
                            <LessonTag to="/">
                                <DatabaseOutlined /> Chương 1: HTML và CSS
                            </LessonTag>
                            <LessonTag to="/">
                                <DatabaseOutlined /> Chương 1: HTML và CSS
                            </LessonTag>
                        </Wrapper>
                        <Wrapper>
                            <Tag>Bài tập/ bài thi</Tag>
                            <LessonTag to="/">
                                <QuestionCircleOutlined /> Chương 1: HTML và CSS
                            </LessonTag>
                            <LessonTag to="/">
                                <QuestionCircleOutlined /> Chương 1: HTML và CSS
                            </LessonTag>
                        </Wrapper>
                    </div>
                </Col>
            </Row>
        </section>
    )
}

export default ContentCourse