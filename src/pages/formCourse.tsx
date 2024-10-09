import { Button, Col, Flex, Form, FormProps, Input, Row, Select } from "antd";
import { useEffect, useState } from "react"
import styled from "styled-components"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CloudUploadOutlined } from "@ant-design/icons";
import { BoxTitle } from "~/services/constants/styled";
import ButtonEdit from "~/services/utils/buttonEdit";
import { useGlobalDataContext } from "~/hooks/globalData";
import { Option } from "~/services/types/dataType";
import SubjectAPI from "~/services/actions/subject";
import CourseAPI from "~/services/actions/course";
import { useSelector } from "react-redux";
import { accountInfoSelector } from "~/services/reducers/selectors";
import { convertUrl } from "~/services/constants";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "~/services/constants/navbarList";

type FieldType = {
    course_name: string
    teacher_Id: string
    subject_Id: string
};

const UploadBox = styled.label`
    border-radius: 10px;
    width: 100%;
    height: 200px;
    border: 1px dashed #000;
    font-size: 20px;
    cursor: pointer;
    display: inline-block;
    background-size: cover;
    background-position: center;
    `

const FormCourse = ({ isEdit }: { isEdit?: boolean }) => {
    const [form] = Form.useForm<FieldType>();
    const [contentCourse, setContentCourse] = useState('');
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const title = `${isEdit ? 'Cập nhật' : 'Tạo'} khóa học`
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [subjectOption, setSubjectOption] = useState<Option[]>([])
    const account = useSelector(accountInfoSelector)
    const [accountId, setAccountId] = useState<string>()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        document.title = title
        getAllSubject()
        if (account?.account_Id) {
            setAccountId(account.account_Id)
        } else navigate(PATH.LOGIN)

        if (id) {
            getOneCourse(id)
        }
    }, [account, id])

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getOneCourse = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await CourseAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setImageSrc(convertUrl(data?.course_image as string))
                setContentCourse(data.course_content)
                form.setFieldsValue({
                    course_name: data.course_name,
                    subject_Id: data.subject_Id,
                    teacher_Id: data.teacher_Id
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

    const getAllSubject = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll(page, limit)
            if (status === 201 && !Array.isArray(data)) {
                setSubjectOption(
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

    const resetForm = () => {
        form.resetFields()
        setContentCourse('')
        setImageSrc(null)
    }

    const createNewCourse = async (data: FormData) => {
        setIsLoading(true)
        try {

            const { status, message } = await CourseAPI.create(data)
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
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

    const updateCourse = async (id: string, data: FormData) => {
        setIsLoading(true)
        try {

            const { status, message } = await CourseAPI.update(id, data)
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                setIsLoading(false)
                navigate(-1)
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
        const formData = new FormData()
        formData.append('course_name', values.course_name as string)
        if (selectedFile) {
            formData.append('file', selectedFile)
        }
        formData.append('subject_Id', values.subject_Id as string)
        formData.append('course_content', contentCourse as string)
        if (accountId) {
            formData.append('teacher_Id', accountId)
        }

        if (isEdit && id) {
            await updateCourse(id, formData)
        } else {
            await createNewCourse(formData)
            resetForm()
        }
    }

    const handleActionBtn = () => {
        if (isEdit && id) {
            navigate(-1)
        } else {
            resetForm()
        }
    }

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Form
                layout="vertical"
                initialValues={{}}
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <UploadBox
                            htmlFor="image"
                            style={{
                                backgroundImage: `url(${imageSrc})`,
                            }}
                        >
                            <Form.Item
                                style={{ display: 'none' }}
                            >
                                <Input
                                    type="file"
                                    hidden
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Form.Item>
                            {
                                imageSrc?.includes('null') &&
                                <Flex
                                    align="center"
                                    justify="center"
                                    style={{
                                        flexDirection: 'column',
                                        height: '100%'
                                    }}
                                >
                                    <CloudUploadOutlined />
                                    <span>Chọn ảnh</span>
                                </Flex>
                            }
                        </UploadBox>
                    </Col>
                    <Col span={18}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Tên khóa học"
                                    name="course_name"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên khóa học không được trống'
                                        },
                                        {
                                            min: 6,
                                            message: 'Tên khóa học cần ít nhất 6 ký tự'
                                        }
                                    ]}
                                    style={{ width: '100%' }}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Môn học"
                                    name="subject_Id"
                                >
                                    <Select
                                        options={subjectOption}
                                        placeholder="Chọn môn học"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Nội dung"
                                    required
                                >

                                    <ReactQuill
                                        theme="snow"
                                        value={contentCourse}
                                        onChange={setContentCourse}
                                        style={{ height: '40vh' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Flex
                            justify="flex-end"
                            style={{
                                paddingTop: '30px',
                                fontWeight: 600
                            }}
                            gap={10}
                        >
                            <Button onClick={handleActionBtn}>
                                {isEdit ? 'Thoát' : 'Làm mới'}
                            </Button>
                            {
                                isEdit ?
                                    <ButtonEdit
                                        text="Cập nhật"
                                        htmlType="submit"
                                    /> :
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Tạo mới
                                    </Button>
                            }
                        </Flex>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default FormCourse