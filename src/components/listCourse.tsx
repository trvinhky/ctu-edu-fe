import { Button, Col, Flex, Form, Input, Modal, Rate, Row, Select, Table, Typography } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { EyeOutlined, FileUnknownOutlined, FilterOutlined, OrderedListOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import ButtonEdit from '~/services/utils/buttonEdit';
import { Link } from 'react-router-dom';
import { Option } from '~/services/types/dataType';
import { useGlobalDataContext } from '~/hooks/globalData';
import CourseAPI from '~/services/actions/course';
import SubjectAPI from '~/services/actions/subject';
import { CourseInfo } from '~/services/types/course';
import HtmlContent from '~/components/htmlContent';
import { convertDate, convertUrl, ENV } from '~/services/constants';

interface DataType {
    key: string;
    name: string;
    subject: string;
    teacher: string;
}

type FieldType = {
    subject?: string;
    title?: string;
};

const BoxText = styled.div`
    &>span:first-child {
        font-weight: 600;
    }
`

const Image = styled.span`
    display: block;
    border-radius: 4px;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }
`

interface PropsType {
    children: React.ReactNode
    title: string
    isAction?: boolean
}

const ListCourse = ({ children, title, isAction }: PropsType) => {
    const [open, setOpen] = useState(false);
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [subjectOptions, setSubjectOptions] = useState<Option[]>([])
    const [course, setCourse] = useState<CourseInfo>()

    useEffect(() => {
        document.title = title
        getAllCourse()
        getAllSubject()
    }, [])

    const getAllSubject = async () => {
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

    const getAllCourse = async (page?: number, title?: string, subject?: string, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CourseAPI.getAll(page, title, subject, limit)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.courses.map((course) => {
                        const result: DataType = {
                            key: course.course_Id,
                            name: course.course_name,
                            subject: course.subject.subject_name,
                            teacher: course.teacher.profile.profile_name
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

    const getOneCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CourseAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setCourse(data)
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

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Môn học',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Người dạy',
            dataIndex: 'teacher',
            key: 'teacher',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Flex
                    align='center'
                    justify='flex-start'
                    gap={10}
                    wrap='wrap'
                >
                    <Button
                        type="primary"
                        onClick={() => handleClickWatch(record.key)}
                    >
                        <EyeOutlined />
                    </Button>
                    {
                        isAction &&
                        <>
                            <Link to={`/course-update/${record.key}`}>
                                <ButtonEdit />
                            </Link>
                            <Link to={'/teacher/manager-lesson/ddd'}>
                                <Button
                                    type='primary'
                                    style={{ backgroundColor: '#f9ca24' }}
                                >
                                    <OrderedListOutlined />
                                </Button>
                            </Link>
                            <Link to={'/teacher/exam/hh'}>
                                <Button
                                    type='primary'
                                    style={{ backgroundColor: '#130f40' }}
                                >
                                    <FileUnknownOutlined />
                                </Button>
                            </Link>
                        </>
                    }
                </Flex>
            ),
        },
    ];

    const handleClickWatch = async (key: string) => {
        setOpen(true);
        await getOneCourse(key)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        await getAllCourse(1, values.title, values.subject)
    }

    return (
        <>
            {children}
            <Form
                initialValues={{}}
                onFinish={onFinish}
            >
                <Flex
                    align='center'
                    justify='flex-end'
                    gap={10}
                    style={{ marginBottom: '15px', width: '100%' }}
                >
                    <Form.Item<FieldType>
                        name="title"
                        style={{
                            marginBottom: 0,
                            flex: 1
                        }}
                    >
                        <Input placeholder='Tên khóa học...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="subject"
                        style={{ marginBottom: 0, width: '30%' }}
                    >
                        <Select
                            options={subjectOptions}
                            placeholder="Chọn môn học"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        <FilterOutlined />
                    </Button>
                </Flex>
            </Form>
            <Table columns={columns} dataSource={dataTable} />
            <Modal
                title="Thông tin khóa học"
                open={open}
                onCancel={() => setOpen(false)}
                footer={
                    <Button type="primary" onClick={() => setOpen(false)}>
                        OK
                    </Button>
                }
            >
                <Typography.Title
                    level={4}
                    style={{ textAlign: 'center', marginBottom: '10px' }}
                >
                    {course?.course_name}
                </Typography.Title>
                <Flex
                    align='center'
                    justify='center'
                    style={{ paddingBottom: '15px' }}
                >
                    <Rate allowHalf defaultValue={2.5} />
                </Flex>
                <Row gutter={[10, 10]}>
                    <Col span={8}>
                        <Image>
                            {course?.course_image && <img src={convertUrl(`${ENV.BE_HOST}\\${course?.course_image}`)} alt="" />}
                        </Image>
                    </Col>
                    <Col span={16}>
                        <BoxText>
                            <span>Môn học: </span> {course?.subject.subject_name}
                        </BoxText>
                        <BoxText>
                            <span>Người dạy: </span> {course?.teacher.profile.profile_name}
                        </BoxText>
                        <BoxText>
                            <span>Ngày tạo: </span> {course?.createdAt && convertDate(course?.createdAt.toString())}
                        </BoxText>
                        <BoxText>
                            <span>Cập nhật gần nhất: </span> {course?.updatedAt && convertDate(course?.updatedAt.toString())}
                        </BoxText>
                    </Col>
                </Row>
                <BoxText>
                    <span>Nội dung: </span>
                    <Typography.Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}>
                        {course?.course_content && <HtmlContent htmlContent={course?.course_content} />}
                    </Typography.Paragraph>
                </BoxText>
            </Modal>
        </>
    )
}

export default ListCourse