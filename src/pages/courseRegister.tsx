import { ExclamationCircleFilled, EyeOutlined, FilterOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, FormProps, Input, Modal, Row, Select, Table, TableProps, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import HtmlContent from '~/components/htmlContent';
import { useGlobalDataContext } from '~/hooks/globalData';
import CourseAPI from '~/services/actions/course';
import EnrollmentAPI, { EnrollmentProps } from '~/services/actions/enrollment';
import SubjectAPI from '~/services/actions/subject';
import { convertDate, convertUrl } from '~/services/constants';
import { BoxTitle } from '~/services/constants/styled';
import { accountInfoSelector } from '~/services/reducers/selectors';
import { CourseInfo } from '~/services/types/course';
import { Option } from '~/services/types/dataType';

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

const CourseRegister = () => {
    const title = 'Danh sách khóa học'
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [course, setCourse] = useState<CourseInfo>()
    const [open, setOpen] = useState(false);
    const [subjectOptions, setSubjectOptions] = useState<Option[]>([])
    const account = useSelector(accountInfoSelector)

    useEffect(() => {
        document.title = title
        getAllSubject()
        if (account) {
            getAllEnrollment({ student: account.account_Id })
        }
    }, [account])

    const getAllEnrollment = async (params: EnrollmentProps) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await EnrollmentAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.enrollments.map((enrollment) => {
                        const course = enrollment.course
                        const result: DataType = {
                            key: enrollment.course_Id,
                            name: course.course_name,
                            subject: course.subject.subject_name,
                            teacher: course.teacher?.profile.profile_name as string
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

    const handleClickWatch = async (key: string) => {
        setOpen(true);
        await getOneCourse(key)
    }

    const showPromiseConfirm = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn rời khóa học này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                if (account && account.account_Id) {
                    await leaveCourse(id)
                }
            },
            onCancel() { },
        });
    };

    const leaveCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message } = await EnrollmentAPI.delete({
                course_Id: id,
                student_Id: account?.account_Id as string
            })
            if (status === 200) {
                await getAllEnrollment({ student: account?.account_Id as string })
            }

            messageApi.open({
                type: status === 200 ? 'success' : 'error',
                content: message,
                duration: 3,
            });
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
                    <Button
                        type='primary'
                        style={{ backgroundColor: '#e74c3c' }}
                        onClick={() => showPromiseConfirm(record.key)}
                    >
                        <LogoutOutlined />
                    </Button>
                </Flex>
            ),
        },
    ];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    }

    return (
        <section>
            <BoxTitle>{title}</BoxTitle>
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
                <Row gutter={[10, 10]}>
                    <Col span={8}>
                        <Image>
                            {course?.course_image && <img src={convertUrl(course?.course_image)} alt="" />}
                        </Image>
                    </Col>
                    <Col span={16}>
                        <BoxText>
                            <span>Môn học: </span> {course?.subject.subject_name}
                        </BoxText>
                        <BoxText>
                            <span>Người dạy: </span> {course?.teacher?.profile.profile_name}
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
        </section>
    )
}

export default CourseRegister