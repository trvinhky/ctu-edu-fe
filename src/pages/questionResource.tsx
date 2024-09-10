import { PlusOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Modal, Row } from "antd"
import { useEffect, useState } from "react"
import FormResource from "~/components/formResource"
import Resource from "~/components/resource"
import { BoxTitle } from "~/services/constants/styled"

const QuestionResource = () => {
    const title = 'Danh sách file đính kèm'
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = title
    }, [])

    const showModel = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex
                align='center'
                justify='flex-end'
                gap={10}
                style={{ marginBottom: '15px' }}
            >
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={showModel}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Modal
                title="Thêm file mới"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Hủy"
            >
                <FormResource />
            </Modal>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Resource />
                </Col>
                <Col span={8}>
                    <Resource />
                </Col>
                <Col span={8}>
                    <Resource />
                </Col>
                <Col span={8}>
                    <Resource />
                </Col>
            </Row>
        </>
    )
}

export default QuestionResource