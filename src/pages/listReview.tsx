import { Col, Flex, Pagination, Row } from "antd"
import { useEffect } from "react"
import CardReview from "~/components/cardReview"
import { BoxTitle } from "~/services/constants/styled"

const ListReview = () => {
    const title = 'Danh sách review'
    useEffect(() => {
        document.title = title
    }, [])

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <CardReview isAction={true} />
                </Col>
                <Col span={12}>
                    <CardReview isAction={true} />
                </Col>
                <Col span={12}>
                    <CardReview isAction={true} />
                </Col>
                <Col span={12}>
                    <CardReview isAction={true} />
                </Col>
                <Col span={24}>
                    <Flex align='center' justify='center'>
                        <Pagination defaultCurrent={1} total={50} />
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export default ListReview