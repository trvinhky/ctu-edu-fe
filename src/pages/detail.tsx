import { CaretLeftOutlined, CaretRightOutlined, ExclamationCircleFilled } from "@ant-design/icons"
import { Button, Col, Flex, Modal, Row } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import cardImg from '~/assets/images/work.jpeg'
import HtmlContent from "~/components/htmlContent"
import { useGlobalDataContext } from "~/hooks/globalData"
import AccountAPI from "~/services/actions/account"
import CourseAPI, { CourseParams } from "~/services/actions/course"
import { convertDate, convertUrl } from "~/services/constants"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle, TitleLink } from "~/services/constants/styled"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"
import { CourseInfo } from "~/services/types/course"
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom"
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import EnrollmentAPI from "~/services/actions/enrollment"
import Card from "~/components/card"

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

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [course, setCourse] = useState<CourseInfo>()
    const account = useSelector(accountInfoSelector)
    const token = useSelector(accountTokenSelector)
    const dispatch = useDispatch();
    const [accountId, setAccountId] = useState<string>()
    const [isRegister, setIsRegister] = useState<boolean>(false)
    const [listCourses, setListCourses] = useState<CourseInfo[]>([])

    useEffect(() => {
        if (token) {
            if (account) {
                setAccountId(account.account_Id)
            } else {
                getInfo()
            }
        }

        if (id) {
            getOneCourse(id)
        } else navigate(-1)

        if (id && accountId) {
            checkRegisterCourse(id)
        }
    }, [token, account, id, setAccountId, accountId])

    const getInfo = async () => {
        try {
            setIsLoading(true)
            const { data } = await AccountAPI.getOne()
            setIsLoading(false)
            if (data && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setAccountId(data.account_Id)
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const checkRegisterCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await EnrollmentAPI.getAll({
                course: id,
                student: accountId as string
            })
            if (status === 201 && !Array.isArray(data)) {
                if (data.count > 0) {
                    setIsRegister(true)
                } else setIsRegister(false)
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

    const handleRegisterCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message } = await EnrollmentAPI.register({
                course_Id: id,
                student_Id: accountId as string
            })
            if (status === 200) {
                setIsRegister(true)
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

    const getOneCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CourseAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setCourse(data)
                document.title = data.course_name
                await getAllCourse({
                    page: 1,
                    subject: data.subject_Id,
                    id: data.course_Id
                })
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

    const showPromiseConfirm = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn rời khóa học này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                if (account && account.account_Id) {
                    await leaveCourse(id)
                }
            },
            onCancel() { },
        });
    };

    const leaveCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message } = await EnrollmentAPI.delete({
                course_Id: id,
                student_Id: account?.account_Id as string
            })
            if (status === 200) {
                await checkRegisterCourse(id)
            }

            messageApi.open({
                type: status === 200 ? 'success' : 'error',
                content: message,
                duration: 3,
            });
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
                            {course?.course_content && <HtmlContent htmlContent={course?.course_content} />}
                        </div>
                    </Col>
                    <Col span={24}>
                        <Flex justify="flex-end" gap={10}>
                            {
                                !isRegister ?
                                    <Button
                                        type="primary"
                                        onClick={() => handleRegisterCourse(course.course_Id)}
                                    >
                                        Đăng ký <CaretRightOutlined />
                                    </Button> :
                                    <>
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: '#e74c3c' }}
                                            onClick={() => showPromiseConfirm(course.course_Id)}
                                        >
                                            <CaretLeftOutlined /> Rời lớp học
                                        </Button>
                                        <ButtonLinkCustom href={PATH.CONTENT_COURSE.replace(':id', course.course_Id)} shape="default">
                                            Xem thông tin <CaretRightOutlined />
                                        </ButtonLinkCustom>
                                    </>
                            }
                        </Flex>
                    </Col>
                </Row>
            }
            <TitleLink to={PATH.SEARCH}>
                Khóa học đề xuất
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
        </>
    )
}

export default Detail