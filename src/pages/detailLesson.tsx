import { DollarOutlined } from "@ant-design/icons";
import { Button, Flex, Tag } from "antd";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import LessonAPI from "~/services/actions/lesson";
import { ENV } from "~/services/constants";
import { Title } from "~/services/constants/styled";
import { LessonInfo } from "~/services/types/lesson";
import ButtonBack from "~/services/utils/buttonBack";

const CustomTitle = styled(Title)`
    display: flex;
    gap: 5px;
    align-items: center;
`

const DetailLesson = () => {
    const [title, setTitle] = useState<string>()
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [lessonInfo, setLessonInfo] = useState<LessonInfo>()
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getOneLesson(id)
        } else navigate(-1)
    }, [id])

    const readFile = async (url: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${ENV.BE_HOST}/file/read-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName: url })
            })

            if (!response.ok) {
                messageApi.open({
                    type: 'error',
                    content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                    duration: 3,
                });
                return
            }

            const data = await response.json()
            // Chuyển object sang Uint8Array
            const uint8Array = new Uint8Array(Object.values(data));

            // Tạo Blob từ Uint8Array
            const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });

            // Tạo URL từ Blob để có thể hiển thị trong iframe
            const newURL = URL.createObjectURL(pdfBlob);
            console.log('obj: ', newURL)

            setPdfUrl(newURL);
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }


    const getOneLesson = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await LessonAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setLessonInfo(data)
                setTitle(data.lesson_title)
                document.title = data.lesson_title
                await readFile(data.lesson_url)
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
            {
                lessonInfo &&
                <section>
                    <Flex justify="flex-start">
                        <ButtonBack />
                    </Flex>
                    <CustomTitle>
                        {title}
                        <Tag icon={<DollarOutlined />} color="warning">
                            {lessonInfo.lesson_score === 0 ? 'free' : lessonInfo.lesson_score}
                        </Tag>
                    </CustomTitle>
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="600px"
                            title="PDF Viewer"
                        />
                    ) : (
                        <p>Loading PDF...</p>
                    )}
                    <Flex justify="flex-end" style={{ padding: '10px 0 15px' }}>
                        <Button
                            type="primary"
                            style={{
                                background: '#27ae60'
                            }}
                        >
                            Xem đầy đủ
                        </Button>
                    </Flex>
                    <p>
                        {lessonInfo.lesson_content}
                    </p>
                </section>
            }
        </>
    )
}

export default DetailLesson