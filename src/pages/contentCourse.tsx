import { DatabaseOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { Col, Row } from "antd"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import ExamContent from "~/components/examContent"
import LessonContent from "~/components/lessonContent"
import { useGlobalDataContext } from "~/hooks/globalData"
import CourseAPI from "~/services/actions/course"
import ExamAPI from "~/services/actions/exam"
import LessonAPI from "~/services/actions/lesson"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"
import { ExamInfo } from "~/services/types/exam"
import { LessonInfo } from "~/services/types/lesson"

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
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [title, setTitle] = useState('')
    const [listLesson, setListLesson] = useState<LessonInfo[]>([])
    const [exams, setExams] = useState<ExamInfo[]>([])
    const [isLesson, setIsLesson] = useState<boolean>(true)
    const path = PATH.CONTENT_COURSE.replace(':id', id as string)
    const checkPath = location.pathname.includes('exam');
    const [lessonActive, setLessonActive] = useState<string | undefined>()

    useEffect(() => {
        if (checkPath) {
            setIsLesson(false)
        } else setIsLesson(true)
        if (id) {
            getOneCourse(id)
            getAllLesson(id)
            getAllExams(1, id)
        } else navigate(-1)
    }, [id, checkPath])

    const getOneCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CourseAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                document.title = data.course_name
                setTitle(data.course_name)
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

    const getAllLesson = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await LessonAPI.getAll({ id: id as string })
            if (status === 201 && !Array.isArray(data)) {
                if (data.lessons[0]) {
                    setLessonActive(data.lessons[0].lesson_Id)
                }
                setListLesson(data.lessons)
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

    const getAllExams = async (page?: number, course?: string, limit: number = 10) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await ExamAPI.getAll(page, course, limit)
            if (status === 201 && !Array.isArray(data)) {
                setExams(data.exams)
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
        <section>
            <Title>{title}</Title>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    {isLesson ? <LessonContent lessonId={lessonActive} /> : <ExamContent />}
                </Col>
                <Col span={8}>
                    <div>
                        <Wrapper>
                            <Tag>Bài học</Tag>
                            {
                                listLesson?.map((lesson) => (
                                    <LessonTag
                                        to={`${path}?lesson=${lesson.lesson_Id}`}
                                        key={lesson.lesson_Id}
                                        onClick={() => setIsLesson(true)}
                                    >
                                        <DatabaseOutlined /> {lesson.lesson_title}
                                    </LessonTag>
                                ))
                            }
                        </Wrapper>
                        <Wrapper>
                            <Tag>Bài tập/ bài thi</Tag>
                            {
                                exams?.map((exam) => (
                                    <LessonTag
                                        to={`${path}?exam=${exam.exam_Id}`}
                                        key={exam.exam_Id}
                                        onClick={() => setIsLesson(false)}
                                    >
                                        <QuestionCircleOutlined /> {exam.exam_title}
                                    </LessonTag>
                                ))
                            }
                        </Wrapper>
                    </div>
                </Col>
            </Row>
        </section>
    )
}

export default ContentCourse