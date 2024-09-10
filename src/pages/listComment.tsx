import { Col, Flex, Pagination, Row } from "antd"
import { useEffect } from "react"
import Comment from "~/components/comment"
import { BoxTitle } from "~/services/constants/styled"

const ListComment = () => {
    const title = 'Danh sách bình luận'
    useEffect(() => {
        document.title = title
    }, [])

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Comment isAction={true} />
                </Col>
                <Col span={12}>
                    <Comment isAction={true} />
                </Col>
                <Col span={12}>
                    <Comment isAction={true} />
                </Col>
                <Col span={12}>
                    <Comment isAction={true} />
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

export default ListComment