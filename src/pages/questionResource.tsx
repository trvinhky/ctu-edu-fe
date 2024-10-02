import { PlusOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Row } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import FormResource from "~/components/formResource"
import Resource from "~/components/resource"
import { useGlobalDataContext } from "~/hooks/globalData"
import QuestionResourceAPI from "~/services/actions/question_resource"
import { BoxTitle } from "~/services/constants/styled"
import { QuestionResourceInfo } from "~/services/types/question_resource"
import ButtonBack from "~/services/utils/buttonBack"

const QuestionResource = () => {
    const title = 'Danh sách file đính kèm'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [resources, setResources] = useState<QuestionResourceInfo[]>()
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        document.title = title
        if (id) {
            getAllResources(id)
        } else navigate(-1)
    }, [id])

    const showModel = () => {
        setIsModalOpen(true)
    }

    const getAllResources = async (idFind: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await QuestionResourceAPI.getAll(1, idFind)
            if (status === 201 && !Array.isArray(data)) {
                setResources(data.questionResources)
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

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex
                align='center'
                justify='space-between'
                gap={10}
                style={{ marginBottom: '15px' }}
            >
                <ButtonBack />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={showModel}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <FormResource
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                getAllResources={getAllResources}
                id={id as string}
            />
            <Row gutter={[16, 16]}>
                {
                    resources?.map((resource) => (
                        <Col span={6} key={resource.question_resource_Id}>
                            <Resource
                                dataResource={resource}
                                getAllResources={getAllResources}
                                id={id as string}
                            />
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default QuestionResource