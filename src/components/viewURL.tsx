import { Button, Modal } from "antd"
import { useState } from "react"
import styled from "styled-components"
import ViewIcon from "~/components/viewIcon"
import ViewPDF from "~/components/viewPDF"

const Wrapper = styled.div`
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
`

const WrapperImage = styled.div`
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    padding-bottom: 15px;
    font-size: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
`

interface URLProps {
    url: string
    category: string
}

const ResourceInfo = ({ category, url }: { category: string, url: string }) => {
    switch (category) {
        case 'document':
            if (url.includes('pdf')) {
                return <ViewPDF pdfUrl={url} />
            }
            return <></>
        default:
            return <></>
    }
}

const ViewURL = ({ url, category }: URLProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const showModal = () => {
        if (category === 'image') {
            setIsModalOpen(false)
        } else setIsModalOpen(true)
    }

    return (
        <Wrapper>
            <WrapperImage onClick={showModal}>
                <ViewIcon category={category} url={url} isShowImg={category === 'image'} />
            </WrapperImage>
            <Modal
                title="Nội dung file"
                open={isModalOpen}
                onOk={closeModal}
                onCancel={closeModal}
                style={{
                    width: 'fit-content',
                    maxWidth: '60vw'
                }}
                footer={[
                    <Button type="primary" onClick={closeModal}>
                        OK
                    </Button>
                ]}
            >
                <ResourceInfo category={category} url={url} />
            </Modal>
        </Wrapper>
    )
}

export default ViewURL