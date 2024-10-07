import { Col, Flex, Pagination, Row } from "antd"
import { useEffect, useState } from "react";
import BoxLesson from "~/components/boxLesson"
import { useGlobalDataContext } from "~/hooks/globalData";
import LessonAPI from "~/services/actions/lesson";
import { LessonInfo } from "~/services/types/lesson";

const ViewLesson = ({ courseId }: { courseId: string }) => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listLesson, setListLesson] = useState<LessonInfo[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    useEffect(() => {
        if (courseId)
            getAllLesson(courseId, pagination.current, pagination.pageSize)
    }, [courseId, pagination.current, pagination.pageSize])

    const getAllLesson = async (id: string, page?: number, limit?: number) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await LessonAPI.getAll({ id: id as string, page, limit })
            if (status === 201 && !Array.isArray(data)) {
                setListLesson(data.lessons)
                setPagination({
                    current: page ?? 1,
                    pageSize: 8,
                    total: data.count
                })
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

    const handlePageChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <section>
            <Row gutter={[16, 16]}>
                {
                    listLesson?.map((lesson) => (
                        <Col span={6} key={lesson.lesson_Id}>
                            <BoxLesson data={lesson} />
                        </Col>
                    ))
                }
                <Col span={24}>
                    <Flex justify="center" style={{ paddingTop: 10 }}>
                        <Pagination
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            current={pagination.current}
                            onChange={handlePageChange}
                        />
                    </Flex>
                </Col>
            </Row>
        </section>
    )
}

export default ViewLesson