import { useEffect } from "react"
import { BoxTitle } from "~/services/constants/styled"

const ListBuy = () => {
    const title = 'Bài học đã mua'

    useEffect(() => {
        document.title = title
    }, [])

    return (
        <section>
            <BoxTitle>{title}</BoxTitle>
        </section>
    )
}

export default ListBuy