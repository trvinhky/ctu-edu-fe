import { UnorderedListOutlined } from "@ant-design/icons"
import { Col, Flex, Row } from "antd"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import Card from "~/components/card"
import ItemPost from "~/components/itemPost"
import { useGlobalDataContext } from "~/hooks/globalData"
import SubjectAPI from "~/services/actions/subject"
import { BoxTitle } from "~/services/constants/styled"
import { SubjectInfo } from "~/services/types/subject"

const SubTitle = styled.h4`
    font-weight: 600;
    border-left: 2px solid #f1c40f;
    padding-left: 10px;
    font-size: 20px;
`

const LinkIcon = styled(Link)`
    color: #000;
    display: inline-block;
    padding: 0 10px;
    font-size: 20px;
`

const Subject = () => {
    const [title, setTitle] = useState('Công nghệ thông tin')
    const { id } = useParams();
    const navigate = useNavigate()
    const [subjectData, setSubjectData] = useState<SubjectInfo>()
    const { setIsLoading, messageApi } = useGlobalDataContext();

    useEffect(() => {
        if (id) {
            getOneSubject(id)
        } else navigate(-1)
    }, [id])

    const getOneSubject = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await SubjectAPI.getOne(id, true)
            if (status === 201 && !Array.isArray(data)) {
                setSubjectData(data)
                setTitle(data.subject_name)
                document.title = data.subject_name
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
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex
                justify="space-between"
                align="center"
                style={{
                    paddingBlock: 20
                }}
            >
                <SubTitle>
                    Khóa học
                </SubTitle>
                <LinkIcon to="/">
                    <UnorderedListOutlined />
                </LinkIcon>
            </Flex>
            <Row gutter={[16, 16]}>
                {
                    subjectData?.courses?.map((course, i) => (
                        i < 5 &&
                        <Col span={6} key={course.course_Id}>
                            <Card data={{
                                ...course,
                                subject: {
                                    subject_name: title
                                }
                            }} />
                        </Col>
                    ))
                }
            </Row>
            <Flex
                justify="space-between"
                align="center"
                style={{
                    paddingBottom: 20,
                    paddingTop: 30
                }}
            >
                <SubTitle>
                    Bài đăng
                </SubTitle>
                <LinkIcon to="/">
                    <UnorderedListOutlined />
                </LinkIcon>
            </Flex>
            <Row gutter={[16, 16]}>
                {
                    subjectData?.posts?.map((post, i) => (
                        i < 5 &&
                        <Col span={12} key={post.post_Id}>
                            <ItemPost data={post} />
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default Subject