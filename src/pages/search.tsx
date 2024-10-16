import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, FormProps, Input, Pagination, Row, Select } from "antd"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import Card from "~/components/card";
import { useGlobalDataContext } from "~/hooks/globalData";
import CourseAPI, { CourseParams } from "~/services/actions/course";
import SubjectAPI from "~/services/actions/subject";
import { BoxTitle } from "~/services/constants/styled";
import { CourseInfo } from "~/services/types/course";
import { Option } from "~/services/types/dataType";

type FieldType = {
    subject?: string;
    title?: string;
};

const Search = () => {
    const [searchParams] = useSearchParams();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const searchTitle = searchParams.get('title');
    const [listCourses, setListCourses] = useState<CourseInfo[]>([])
    const [subjectOptions, setSubjectOptions] = useState<Option[]>([])
    const [title, setTitle] = useState('Tất cả khóa học')
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    useEffect(() => {
        getAllSubject()
        if (searchTitle) {
            setTitle('Kết quả tìm kiếm')
            getAllCourse({ title: searchTitle })
        } else getAllCourse({})

    }, [searchTitle, title])

    const getAllSubject = async () => {
        document.title = title
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                setSubjectOptions(
                    data.subjects.map((subject) => {
                        const result: Option = {
                            value: subject.subject_Id as string,
                            label: subject.subject_name
                        }

                        return result
                    })
                )
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

    const getAllCourse = async (params: CourseParams) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CourseAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setListCourses(data.courses)
                setPagination((prev) => ({
                    ...prev,
                    total: data.count
                }))
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        await getAllCourse({ page: 1, title: values.title, subject: values.subject })
    }

    const handlePageChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Form
                style={{ paddingBottom: '10px' }}
                onFinish={onFinish}
            >
                <Flex
                    align='center'
                    justify='flex-end'
                    gap={10}
                    style={{ marginBottom: '15px' }}
                >
                    <Form.Item<FieldType>
                        name="title"
                        style={{
                            marginBottom: 0,
                            width: '100%',
                        }}
                    >
                        <Input placeholder='Tên khóa học...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="subject"
                        style={{ marginBottom: 0, width: '40%' }}
                    >
                        <Select
                            style={{ width: "100%" }}
                            placeholder="chọn môn học"
                            options={subjectOptions}
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                    >
                        <SearchOutlined />
                    </Button>
                </Flex>
            </Form>
            <Row gutter={[16, 16]}>
                {
                    listCourses?.map((course) => (
                        <Col span={6} key={course.course_Id}>
                            <Card data={course} />
                        </Col>
                    ))
                }
                <Col span={24}>
                    <Flex
                        align='center'
                        justify='center'
                        style={{ paddingTop: '10px' }}
                    >
                        <Pagination
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            current={pagination.current}
                            onChange={handlePageChange}
                        />
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export default Search