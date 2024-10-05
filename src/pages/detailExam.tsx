import { useEffect } from "react"
import ExamContent from "~/components/examContent"
import { BoxTitle } from "~/services/constants/styled"

const DetailExam = () => {
    const title = 'Thông tin bài tập / bài thi'
    useEffect(() => {
        document.title = title
    }, [])

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <ExamContent />
        </>
    )
}

export default DetailExam