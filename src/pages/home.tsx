import { Col, Flex, Row } from 'antd'
import { useEffect, useState } from 'react'
import Card from '~/components/card'
import ItemPost from '~/components/itemPost'
import { useGlobalDataContext } from '~/hooks/globalData'
import CourseAPI, { CourseParams } from '~/services/actions/course'
import PostAPI, { ParamsAll } from '~/services/actions/post'
import SubjectAPI from '~/services/actions/subject'
import { PATH } from '~/services/constants/navbarList'
import { TitleLink } from '~/services/constants/styled'
import { CourseInfo } from '~/services/types/course'
import { PostInfo } from '~/services/types/post'
import { SubjectInfo } from '~/services/types/subject'
import ButtonLinkCustom from '~/services/utils/buttonLinkCustom'

const Home = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listSubjects, setListSubjects] = useState<SubjectInfo[]>()
    const [listCourses, setListCourses] = useState<CourseInfo[]>([])
    const [listPosts, setListPosts] = useState<PostInfo[]>([])

    useEffect(() => {
        document.title = 'Trang chủ'
        getAllSubject()
        getAllCourse({ page: 1 })
        getAllPost({ page: 1 })
    }, [])

    const getAllSubject = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll(page, limit)
            if (status === 201 && !Array.isArray(data)) {
                setListSubjects(data.subjects)
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

    const getAllCourse = async (params: CourseParams) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CourseAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setListCourses(data.courses)
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

    const getAllPost = async (params: ParamsAll) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await PostAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setListPosts(data.posts)
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
            <Flex
                align='center'
                justify='center'
                gap='10px'
                wrap='wrap'
                style={{
                    paddingBottom: '20px'
                }}
            >
                {
                    listSubjects?.map((subject) => (
                        <ButtonLinkCustom
                            href={`${PATH.SUBJECT.replace(':id', subject.subject_Id as string)}`}
                            key={subject.subject_Id}
                        >
                            {subject.subject_name}
                        </ButtonLinkCustom>
                    ))
                }
            </Flex>
            <TitleLink to={PATH.SEARCH}>
                Khóa học
            </TitleLink>
            <Row gutter={[16, 16]}>
                {
                    listCourses?.map((course) => (
                        <Col span={6} key={course.course_Id}>
                            <Card data={course} />
                        </Col>
                    ))
                }
            </Row>
            <TitleLink to={PATH.LIST_POST}>
                Bài viết
            </TitleLink>
            <Row gutter={[16, 16]}>
                {
                    listPosts?.map((post) => (
                        <Col span={12} key={post.post_Id}>
                            <ItemPost data={post} />
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default Home