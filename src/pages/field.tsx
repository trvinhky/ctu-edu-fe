import { Col, Flex, Pagination, Row } from "antd"
import { useEffect } from "react"
import Card from "~/components/card"
import { BoxTitle } from "~/services/constants/styled"

const Field = () => {
    const title = 'Công nghệ thông tin'
    useEffect(() => {
        document.title = title
    }, [])

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={24}>
                    <Flex
                        align='center'
                        justify='center'
                        style={{ paddingTop: '10px' }}
                    >
                        <Pagination
                            defaultCurrent={1}
                            total={50}
                        />
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export default Field