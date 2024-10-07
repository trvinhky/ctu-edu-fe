import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ExamContent from "~/components/examContent"
import { useGlobalDataContext } from "~/hooks/globalData"
import ExamAPI from "~/services/actions/exam"
import { BoxTitle } from "~/services/constants/styled"
import { ExamInfo } from "~/services/types/exam"

const DetailExam = () => {
    const [title, setTitle] = useState('Thông tin bài thi')
    const { id } = useParams();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [examInfo, setExamInfo] = useState<ExamInfo>()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            getOneExam(id)
        } else navigate(-1)
    }, [id])

    const getOneExam = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await ExamAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setExamInfo(data)
                document.title = data.exam_title
                setTitle(data.exam_title)
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
            <BoxTitle>{title}</BoxTitle>
            {
                examInfo &&
                <ExamContent data={examInfo} />
            }
        </>
    )
}

export default DetailExam