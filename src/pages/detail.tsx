import { CaretRightOutlined, StarFilled } from "@ant-design/icons"
import { Button, Col, Flex, Pagination, Rate, Row } from "antd"
import { useEffect, useState } from "react"
import ReactQuill from "react-quill"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import cardImg from '~/assets/images/work.jpeg'
import CardReview from "~/components/cardReview"
import HtmlContent from "~/components/htmlContent"
import { useGlobalDataContext } from "~/hooks/globalData"
import CourseAPI from "~/services/actions/course"
import { convertDate, convertUrl } from "~/services/constants"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"
import { CourseInfo } from "~/services/types/course"
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom"

const Info = styled.div`
    font-size: 18px;
`

const Image = styled.span`
    display: block;
    border-radius: 10px;
    overflow: hidden;

    img {
        width: 100%;
        object-fit: cover;
    }
`

const BoxText = styled.p`
    span {
        font-weight: 600;
    }
`

const SubTitle = styled(BoxTitle)`
    font-size: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 10px;
    margin-top: 20px;
`

const BoxReview = styled.div`
    padding-bottom: 20px;

    h6 {
        padding-bottom: 10px;
        font-weight: 600;
        font-size: 16px;
    }
`

const WrapperBox = styled.div`
    padding: 15px 0 60px;
`

const Detail = () => {
    const [contentReview, setContentReview] = useState('');
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [course, setCourse] = useState<CourseInfo>()

    useEffect(() => {
        if (id) {
            getOneCourse(id)
        } else navigate(-1)
    }, [])

    const getOneCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CourseAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setCourse(data)
                document.title = data.course_name
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
                course &&
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Info>
                            <Image>
                                <img
                                    src={course.course_image ? convertUrl(course?.course_image) : cardImg}
                                    alt="image"
                                />
                            </Image>
                            <BoxText>
                                <span>Người dạy: </span>{course.teacher?.profile?.profile_name}
                            </BoxText>
                            <BoxText>
                                <span>Đánh giá: </span>5<StarFilled style={{ color: '#f1c40f' }} />
                            </BoxText>
                            <BoxText>
                                <span>Ngày tạo: </span>{course?.createdAt && convertDate(course?.createdAt.toString())}
                            </BoxText>
                            <BoxText>
                                <span>Cập nhật gần nhất: </span>{course?.updatedAt && convertDate(course?.updatedAt.toString())}
                            </BoxText>
                        </Info>
                    </Col>
                    <Col span={16}>
                        <BoxTitle>
                            {course.course_name}
                        </BoxTitle>
                        <Flex align="center" justify="center">
                            <ButtonLinkCustom
                                href={PATH.SUBJECT.replace(':id', course.subject_Id)}
                            >
                                {course.subject?.subject_name}
                            </ButtonLinkCustom>
                        </Flex>
                        <div style={{ fontSize: '18px', paddingTop: '15px' }}>
                            <p>
                                {course?.course_content && <HtmlContent htmlContent={course?.course_content} />}
                            </p>
                        </div>
                    </Col>
                    <Col span={24}>
                        <Flex justify="flex-end" gap={10}>
                            <ButtonLinkCustom href={PATH.CONTENT_COURSE.replace(':id', course.course_Id)} shape="default">
                                Xem thông tin <CaretRightOutlined />
                            </ButtonLinkCustom>
                            <Button type="primary">
                                Đăng ký <CaretRightOutlined />
                            </Button>
                        </Flex>
                    </Col>
                    <Col span={24}>
                        <SubTitle>Review</SubTitle>
                    </Col>
                    <Col span={24}>
                        <BoxReview>
                            <h6>Tạo review</h6>
                            <Rate allowHalf defaultValue={2.5} />
                            <WrapperBox>
                                <ReactQuill
                                    theme="snow"
                                    value={contentReview}
                                    onChange={setContentReview}
                                    style={{ height: '40vh' }}
                                />
                            </WrapperBox>
                            <Flex
                                justify="flex-end"
                            >
                                <Button type="primary">
                                    Tạo mới
                                </Button>
                            </Flex>
                        </BoxReview>
                    </Col>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <CardReview />
                        </Col>
                        <Col span={12}>
                            <CardReview />
                        </Col>
                        <Col span={24}>
                            <Flex align='center' justify='center'>
                                <Pagination defaultCurrent={1} total={50} />
                            </Flex>
                        </Col>
                    </Row>
                </Row>
            }
        </>
    )
}

export default Detail