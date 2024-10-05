import { Button, Col, DatePicker, Flex, Form, FormProps, Input, InputNumber, Row } from "antd"
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalDataContext } from "~/hooks/globalData";
import ExamAPI from "~/services/actions/exam";
import { DATEFORMAT_FULL } from "~/services/constants";
import { BoxTitle } from "~/services/constants/styled"
import { Exam } from "~/services/types/exam";
import ButtonBack from "~/services/utils/buttonBack";
import ButtonEdit from "~/services/utils/buttonEdit";

type FieldType = {
    exam_title?: string
    exam_description?: string
    exam_total_score?: number
    exam_start_time?: Dayjs
    exam_limit?: number
};

const FormExam = ({ isEdit }: { isEdit?: boolean }) => {
    const title = `${isEdit ? 'Cập nhật' : 'Thêm mới'} bài tập / bài thi`
    const { id } = useParams();
    const [form] = Form.useForm<FieldType>();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();

    useEffect(() => {
        document.title = title
        if (id && isEdit) {
            getOneExam(id)
        }
    }, [id, isEdit])

    const handleActionBtn = () => {
        if (isEdit && id) {
            navigate(-1)
        } else {
            form.resetFields()
        }
    }

    const getOneExam = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await ExamAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                form.setFieldsValue({
                    exam_description: data.exam_description,
                    exam_title: data.exam_title,
                    exam_total_score: data.exam_total_score,
                    exam_limit: data.exam_limit,
                    exam_start_time: data.exam_start_time ?
                        dayjs(data.exam_start_time) : undefined
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)

        try {
            let status: number = 200
            let message: string = ''
            const data: Exam = {
                course_Id: id as string,
                exam_limit: values.exam_limit as number,
                exam_title: values.exam_title as string,
                exam_description: values.exam_description,
                exam_total_score: values.exam_total_score as number,
                exam_start_time: values.exam_start_time?.toDate(),
                exam_Id: id as string
            }
            if (isEdit) {
                const res = await ExamAPI.update(data)
                status = res.status
                message = res.message as string
            } else {
                const res = await ExamAPI.create(data)
                if (res.status === 200) form.resetFields()
                status = res.status
                message = res.message as string
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

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Flex justify="flex-start" style={{ paddingBottom: 15 }}>
                <ButtonBack />
            </Flex>
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    name="exam_title"
                    label="Tiêu đề"
                    rules={[{
                        required: true,
                        message: 'Vui lòng nhập tiêu đề!'
                    }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    name="exam_description"
                    label="Mô tả"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Form.Item<FieldType>
                            name="exam_start_time"
                            label="Thời gian bắt đầu"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn thời gian"
                                showTime={{ format: 'HH:mm' }}
                                format={DATEFORMAT_FULL}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item<FieldType>
                            name="exam_limit"
                            label="Thời gian"
                        >
                            <InputNumber min={0} placeholder="Nhập số phút" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item<FieldType>
                            name="exam_total_score"
                            label="Số điểm"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Col span={24}>
                    <Flex
                        justify="flex-end"
                        style={{
                            paddingTop: '20px',
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
            </Form>
        </>
    )
}

export default FormExam