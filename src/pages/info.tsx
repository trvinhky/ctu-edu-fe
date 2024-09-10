import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Flex, Form, Image, Input, Row } from "antd"
import { useEffect } from "react"
import styled from "styled-components"
import { BoxTitle } from "~/services/constants/styled";
import { isValidPhone } from "~/services/constants/validation";

type FieldType = {
    profile_name: string;
    profile_address?: string;
    profile_phone?: string;
    profile_avatar?: string;
    profile_birthday?: string;
    profile_info?: string;
};

const Wrapper = styled.div`
    position: relative;
    width: fit-content;
`

const BoxAvatar = styled.div`
width: 200px;
height: 200px;
border-radius: 50%;
overflow: hidden;
`

const Avatar = styled(Image)`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`

const LabelAvatar = styled.label`
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 2px 8px;
    background-color: #f1c40f;
    color: #fff;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
`

const Info = () => {
    const title = 'Thông tin cá nhân'
    useEffect(() => {
        document.title = title
    }, [])

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Form
                style={{ padding: '0 20px' }}
                layout="vertical"
            >
                <Row gutter={[16, 16]}>
                    <Col span={7}>
                        <Wrapper>
                            <BoxAvatar>
                                <Avatar
                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                            </BoxAvatar>
                            <Form.Item<FieldType>
                                name="profile_avatar"
                                style={{ display: 'none' }}
                            >
                                <Input
                                    type="file"
                                    hidden
                                    id="avatar"
                                    accept="image/jpeg,image/png,image/gif"
                                />
                            </Form.Item>
                            <LabelAvatar htmlFor="avatar">
                                <UploadOutlined />
                            </LabelAvatar>
                        </Wrapper>
                    </Col>
                    <Col span={17}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Tên tài khoản"
                                    name="profile_name"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên tài khoản không được trống'
                                        },
                                        {
                                            min: 6,
                                            message: 'Tên tài khoản cần ít nhất 6 ký tự'
                                        }
                                    ]}
                                    style={{ width: '100%' }}
                                >
                                    <Input placeholder="Jack" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="profile_phone"
                                    label="SĐT"
                                    hasFeedback
                                    rules={[
                                        () => ({
                                            validator(_, value) {
                                                if (value && !isValidPhone(value)) {
                                                    return Promise.reject(
                                                        new Error('Số điện thoại không hợp lệ!')
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="profile_birthday"
                                    label="Ngày sinh"
                                >
                                    <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    name="profile_address"
                                    label="Địa chỉ"
                                >
                                    <Input placeholder="Địa chỉ" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    name="profile_info"
                                    label="Giới thiệu"
                                >
                                    <Input.TextArea rows={4} placeholder="Giới thiệu bản thân" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Flex justify="flex-end">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            backgroundColor: '#f1c40f',
                                            fontWeight: 600
                                        }}
                                    >
                                        Cập nhật
                                    </Button>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default Info