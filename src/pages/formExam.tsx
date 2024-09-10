import { Form } from "antd"
import { useEffect } from "react"
import { BoxTitle } from "~/services/constants/styled"

const FormExam = ({ isEdit }: { isEdit?: boolean }) => {
    const title = `${isEdit ? 'Cập nhật' : 'Thêm mới'} bài tập / bài thi`
    useEffect(() => {
        document.title = title
    }, [])

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Form layout="vertical">

            </Form>
        </>
    )
}

export default FormExam