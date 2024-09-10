import { Button, Flex, Image, Modal, Tag } from "antd"
import { useState } from "react"
import styled from "styled-components"
import FormResource from "~/components/formResource"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"

const Wrapper = styled.div`
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
`

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
`

const WrapperImage = styled.div`
    width: fit-content;
    border-radius: 10px;
    overflow: hidden;
    padding-bottom: 15px;
`

const Resource = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Wrapper>
            <WrapperImage>
                <Image
                    width='100%'
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
            </WrapperImage>
            <Flex justify="space-between" align="center">
                <Tag color="blue">image</Tag>
                <Flex justify="flex-end" gap={10}>
                    <WrapperBtn onClick={showModel}>
                        <ButtonEdit />
                    </WrapperBtn>
                    <ButtonDelete />
                </Flex>
            </Flex>
            <Modal
                title="Cập nhật file đính kìm"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <WrapperBtn
                        style={{ paddingLeft: '10px' }}
                    >
                        <ButtonEdit text="Cập nhật" />
                    </WrapperBtn>
                ]}
            >
                <FormResource />
            </Modal>
        </Wrapper>
    )
}

export default Resource