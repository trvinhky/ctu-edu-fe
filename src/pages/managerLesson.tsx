import { useEffect } from "react"
import { BoxTitle } from "~/services/constants/styled"

const ManagerLesson = () => {
    const title = 'Danh sách bài học'
    useEffect(() => {
        document.title = title
    }, [])

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
        </>
    )
}

export default ManagerLesson