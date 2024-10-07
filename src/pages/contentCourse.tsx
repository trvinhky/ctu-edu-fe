import { Tabs, TabsProps } from "antd"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import styled from "styled-components"
import ViewExam from "~/components/viewExam"
import ViewLesson from "~/components/viewLesson"
import { useGlobalDataContext } from "~/hooks/globalData"
import CourseAPI from "~/services/actions/course"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"

const Title = styled(BoxTitle)`
    text-align: left;
`

const Tag = styled(Link)`
    font-weight: 600;
    font-size: 16px;
    color: #000;
`

const ContentCourse = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const currentTab = searchParams.get('content');
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [activeTab, setActiveTab] = useState("lesson")
    const [title, setTitle] = useState('')
    const path = PATH.CONTENT_COURSE.replace(':id', id as string)
    const checkPath = location.pathname.includes('exam');

    useEffect(() => {
        if (currentTab) {
            setActiveTab(currentTab)
        } else setActiveTab('lesson')
        if (id) {
            getOneCourse(id)
        } else navigate(-1)
    }, [id, checkPath, currentTab])

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

    const items: TabsProps['items'] = [
        {
            key: 'lesson',
            label: <Tag to={`${path}?content=lesson`}>Bài học</Tag>,
            children: <ViewLesson courseId={id as string} />,
        },
        {
            key: 'exam',
            label: <Tag to={`${path}?content=exam`}>Bài thi</Tag>,
            children: <ViewExam />,
        }
    ];

    const onChangeTab = (key: string) => {
        setActiveTab(key)
    };

    return (
        <section>
            <Title>{title}</Title>
            <Tabs
                activeKey={activeTab}
                items={items}
                onChange={onChangeTab}
            />
        </section>
    )
}

export default ContentCourse