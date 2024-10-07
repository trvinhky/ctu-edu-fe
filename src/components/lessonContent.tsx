import { Image } from "antd"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import styled from "styled-components"
import { useGlobalDataContext } from "~/hooks/globalData"
import LessonAPI from "~/services/actions/lesson"
import { LessonInfo } from "~/services/types/lesson"

const SubTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
`

const Content = styled.div`
    padding-bottom: 15px;
`

const LessonContent = ({ lessonId }: { lessonId?: string }) => {
    const [searchParams] = useSearchParams();
    const searchId = searchParams.get('lesson');
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [lesson, setLesson] = useState<LessonInfo>()

    useEffect(() => {
        if (searchId || lessonId)
            getOneLesson((searchId || lessonId) as string)
    }, [searchId, lessonId])

    const getOneLesson = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await LessonAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setLesson(data)
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
                lesson &&
                <Content>
                    <SubTitle>{lesson.lesson_title}</SubTitle>
                    <Image.PreviewGroup>
                        <Image
                            width={200}
                            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                        />
                        <Image
                            width={200}
                            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                        />
                    </Image.PreviewGroup>
                    <p style={{ paddingTop: '10px' }}>
                        {lesson.lesson_content}
                    </p>
                </Content>
            }
        </>
    )
}

export default LessonContent