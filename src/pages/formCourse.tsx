import { Button, Col, Flex, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect, useState } from "react"
import styled from "styled-components"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CloudUploadOutlined } from "@ant-design/icons";
import { BoxTitle } from "~/services/constants/styled";
import ButtonEdit from "~/services/utils/buttonEdit";

type FieldType = {
    course_name: string
    course_image?: string
    course_total?: number
    course_required?: string
    teacher_Id: string
    field_Id: string
};

const UploadBox = styled.label`
    border-radius: 10px;
    width: 100%;
    height: 200px;
    border: 1px dashed #000;
    font-size: 20px;
    cursor: pointer;
    display: inline-block;
`

const FormCourse = ({ isEdit }: { isEdit?: boolean }) => {
    const title = `${isEdit ? 'Cập nhật' : 'Tạo'} khóa học`
    useEffect(() => {
        document.title = title
    }, [])

    const [contentCourse, setContentCourse] = useState('');

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Form
                layout="vertical"
            >
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <UploadBox htmlFor="image">
                            <Form.Item<FieldType>
                                name="course_image"
                                style={{ display: 'none' }}
                            >
                                <Input
                                    type="file"
                                    hidden
                                    id="image"
                                    accept="image/jpeg,image/png,image/gif"
                                />
                            </Form.Item>
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
                            <Col span={15}>
                                <Form.Item<FieldType>
                                    label="Lĩnh vực"
                                    name="field_Id"
                                >
                                    <Select
                                        defaultValue="lucy"
                                        options={[
                                            { value: 'jack', label: 'Jack' },
                                            { value: 'lucy', label: 'Lucy' }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item<FieldType>
                                    label="Đơn giá"
                                    name="course_total"
                                >
                                    <InputNumber
                                        addonAfter="VNĐ"
                                        defaultValue={0}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Yêu cầu"
                                    name="course_required"
                                >
                                    <Input />
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
                            <Button>
                                Làm mới
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