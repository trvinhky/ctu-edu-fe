import { ClockCircleOutlined, EyeOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Col, Flex, Pagination, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import ExamAPI from "~/services/actions/exam";
import { PATH } from "~/services/constants/navbarList";
import { ExamInfo } from "~/services/types/exam";

const BoxExam = styled.div`
    display: flex;
    gap: 10px;
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
`

const ExamText = styled.div`
    h4 {
        font-size: 18px;
        font-weight: 600;
    }
`

const BoxIcon = styled.span`
    display: inline-block;
    padding: 6px 15px;
    border: 1px solid #dadada;
    border-radius: 5px;
    color: #000;
    font-size: 18px;

    a {
        color: inherit;
    }
`

const ViewExam = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listExams, setListExams] = useState<ExamInfo[]>()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    useEffect(() => {
        document.title = "Danh sách bài thi"
        if (id) {
            getAllExams(pagination.current, id, pagination.pageSize)
        } else navigate(-1)
    }, [id, pagination.current, pagination.pageSize])

    const getAllExams = async (page?: number, course?: string, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await ExamAPI.getAll(page, course, limit)
            if (status === 201 && !Array.isArray(data)) {
                setPagination(prev => ({
                    ...prev,
                    total: data.count
                }))
                setListExams(data.exams)
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

    const handlePageChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <section>
            <Row gutter={[16, 16]}>
                {
                    listExams?.map((exam) => (
                        <Col span={6} key={exam.exam_Id}>
                            <BoxExam>
                                <span style={{ fontSize: '10vh' }}>
                                    <FileDoneOutlined />
                                </span>
                                <ExamText>
                                    <h4>{exam.exam_title}</h4>
                                    <Typography.Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}>
                                        {exam.exam_description}
                                    </Typography.Paragraph>
                                    <Flex
                                        justify="flex-end"
                                        gap={10}
                                    >
                                        <BoxIcon>
                                            {exam.exam_limit} <ClockCircleOutlined />
                                        </BoxIcon>
                                        <BoxIcon>
                                            <Link to={PATH.DETAIL_EXAM.replace(':id', exam.exam_Id as string)}>
                                                <EyeOutlined />
                                            </Link>
                                        </BoxIcon>
                                    </Flex>
                                </ExamText>
                            </BoxExam>
                        </Col>
                    ))
                }
                <Col span={24}>
                    <Flex justify="center" style={{ paddingTop: 10 }}>
                        <Pagination
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            current={pagination.current}
                            onChange={handlePageChange}
                        />
                    </Flex>
                </Col>
            </Row>
        </section>
    )
}

export default ViewExam