import { useEffect } from "react"
import { FormTitle } from "~/services/constants/styled"
import { Button, Col, Form, Input, Row } from 'antd';
import type { FormProps } from 'antd';
import { useGlobalDataContext } from "~/hooks/globalData";
import { isValidPassword } from "~/services/constants/validation";
import AccountAPI from '~/services/actions/account'
import { useNavigate } from "react-router-dom";
import { PATH } from "~/services/constants/navbarList";

type FieldType = {
    password?: string;
    confirm?: string;
    code?: string;
};

const NewPassword = () => {
    const title = 'Đổi mật khẩu'
    const { setIsLoading, messageApi, emailSend } = useGlobalDataContext();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = title
    }, [])

    const getCode = async () => {
        setIsLoading(true)
        try {
            if (emailSend) {
                const { status } = await AccountAPI.getCode(emailSend)
                if (status === 200) {
                    messageApi.open({
                        type: 'success',
                        content: 'Vui lòng kiểm tra gmail của bạn!',
                        duration: 3,
                    });
                    setIsLoading(false)
                    return
                }
            }
            messageApi.open({
                type: 'error',
                content: 'Gửi email thất bại!',
                duration: 3,
            });
            setIsLoading(false)
            navigate(PATH.LOGIN)
            return
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
            setIsLoading(false)
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)

        try {
            const { status, message } = await AccountAPI.forgotPassword(
                values.password as string,
                values.code as string,
                emailSend as string
            )

            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                setIsLoading(false)
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
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
        messageApi.open({
            type: 'warning',
            content: 'Vui lòng nhập đầy đủ dữ liệu!',
            duration: 3,
        });
    };

    return (
        <div>
            <FormTitle>{title}</FormTitle>
            <Form
                name="new_password"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: 400 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!'
                        },
                        () => ({
                            validator(_, value) {
                                if (value && isValidPassword(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Mật khẩu phải ít nhất 8 ký tự, có chữ in, chữ thường và số!')
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Nhập lại mật khẩu"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item label="Mã xác thực">
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                name="code"
                                noStyle
                                rules={[{ required: true, message: 'Vui lòng nhập mã xác thực!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button onClick={getCode}>Lấy mã</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default NewPassword