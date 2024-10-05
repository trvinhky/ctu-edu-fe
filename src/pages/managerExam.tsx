import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Pagination } from "antd"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ExamBox from "~/components/examBox";
import { useGlobalDataContext } from "~/hooks/globalData";
import ExamAPI from "~/services/actions/exam";
import { PATH } from "~/services/constants/navbarList";
import { BoxTitle } from "~/services/constants/styled"
import { ExamInfo } from "~/services/types/exam";
import ButtonBack from "~/services/utils/buttonBack";

const Wrapper = styled.div`
    padding-top: 15px;
`

const ManagerExam = () => {
    const { id } = useParams();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [exams, setExams] = useState<ExamInfo[]>([])
    const navigate = useNavigate()

    const title = 'Danh sách bài thi'
    useEffect(() => {
        document.title = title
        if (id) {
            getAllExams(1, id)
        } else navigate(-1)
    }, [id])

    const getAllExams = async (page?: number, course?: string, limit: number = 6) => {
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
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex justify="space-between" gap={10}>
                <ButtonBack />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                >
                    <Link to={`${PATH.CREATE_EXAM.replace(':id', id as string)}`}>
                        <PlusOutlined />
                    </Link>
                </Button>
            </Flex>
            {
                exams?.map((exam) => (
                    <Wrapper key={exam.exam_Id}>
                        <ExamBox data={exam} id={id as string} getAllExams={getAllExams} />
                    </Wrapper>
                ))
            }
            <Flex align='center' justify='center' style={{ paddingTop: 20 }}>
                <Pagination defaultCurrent={1} total={50} />
            </Flex>
        </>
    )
}

export default ManagerExam