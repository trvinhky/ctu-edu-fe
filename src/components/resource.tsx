import { Button, Flex, Modal, Tag } from "antd"
import styled from "styled-components"
import { QuestionResourceInfo } from "~/services/types/question_resource"
import ButtonDelete from "~/services/utils/buttonDelete"
import { ExclamationCircleFilled, FileExcelOutlined, FileExclamationOutlined, FileImageOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileTextOutlined, FileWordOutlined } from "@ant-design/icons"
import { convertUrl } from "~/services/constants"
import { useGlobalDataContext } from "~/hooks/globalData"
import QuestionResourceAPI from "~/services/actions/question_resource"
import { ResourceInfo } from "~/services/types/resource"
import ResourceAPI from "~/services/actions/resource"
import { useState } from "react"
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

const ViewIcon = ({ category, url }: { category: string, url: string }) => {
    switch (category) {
        case 'image':
            return <FileImageOutlined />
        case 'document':
            if (url.includes('pdf')) {
                return <FilePdfOutlined />
            }
            if (url.includes('doc')) {
                return <FileWordOutlined />
            }
            return <FileTextOutlined />
        case 'Presentations and spreadsheets':
            if (url.includes('pptx')) {
                return <FilePptOutlined />
            }
            if (url.includes('xlsx')) {
                return <FileExcelOutlined />
            }
            return <FileExclamationOutlined />
        default:
            return <FileOutlined />
    }
}

interface ResourceProps {
    dataResource: QuestionResourceInfo | ResourceInfo
    getAllResources: (idFind: string) => Promise<void>
    id: string
}

const Resource = ({ dataResource, getAllResources, id }: ResourceProps) => {
    const category = dataResource.category.category_name.toLowerCase()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const resourceURL = (dataResource as ResourceInfo).resource_url ?? (dataResource as QuestionResourceInfo).question_resource_url
    const resourceId = (dataResource as ResourceInfo).resource_Id ?? (dataResource as QuestionResourceInfo).question_resource_Id

    const showPromiseConfirm = (idResource?: string) => {
        Modal.confirm({
            title: 'Bạn có chắc xóa file này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                if (idResource) await deleteResource(idResource)
            },
            onCancel() { },
        });
    };
    const deleteResource = async (idResource: string) => {
        setIsLoading(true)
        try {
            let message = ""
            let status = 200
            if ((dataResource as ResourceInfo).resource_Id) {
                const res = await ResourceAPI.delete(idResource)
                status = res.status
                message = res.message as string
            } else {
                const res = await QuestionResourceAPI.delete(idResource)
                status = res.status
                message = res.message as string
            }
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                await getAllResources(id)
            } else {
                messageApi.open({
                    type: 'error',
                    content: message,
                    duration: 3,
                });
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <Wrapper>
            <WrapperImage onClick={() => setIsModalOpen(true)}>
                <ViewIcon category={category} url={resourceURL} />
            </WrapperImage>
            <Flex justify="space-between" align="center">
                <Tag color="blue">{dataResource.category.category_name}</Tag>
                <Flex justify="flex-end" gap={10}>
                    <div onClick={() => showPromiseConfirm(resourceId)}>
                        <ButtonDelete />
                    </div>
                </Flex>
            </Flex>
            <Modal
                title="Nội dung file"
                open={isModalOpen}
                onOk={closeModal}
                onCancel={closeModal}
                width={'60vw'}
                footer={[
                    <Button type="primary" onClick={closeModal}>
                        OK
                    </Button>
                ]}
            >
                <ViewPDF pdfUrl={convertUrl(resourceURL)} />
            </Modal>
        </Wrapper>
    )
}

export default Resource