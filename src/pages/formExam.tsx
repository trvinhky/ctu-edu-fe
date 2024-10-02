import { Button, Col, DatePicker, Flex, Form, Input, InputNumber, Row } from "antd"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DATEFORMAT_FULL } from "~/services/constants";
import { BoxTitle } from "~/services/constants/styled"
import ButtonBack from "~/services/utils/buttonBack";
import ButtonEdit from "~/services/utils/buttonEdit";

type FieldType = {
    exam_title?: string
    exam_description?: string
    exam_total_score?: number
    exam_start_time?: number
    exam_limit?: number
};

const FormExam = ({ isEdit }: { isEdit?: boolean }) => {
    const title = `${isEdit ? 'Cập nhật' : 'Thêm mới'} bài tập / bài thi`
    const { id } = useParams();
    const [form] = Form.useForm<FieldType>();
    const navigate = useNavigate()

    useEffect(() => {
        document.title = title
    }, [])

    const handleActionBtn = () => {
        if (isEdit && id) {
            navigate(-1)
        } else {
            form.resetFields()
        }
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