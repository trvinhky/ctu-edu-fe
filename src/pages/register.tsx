import type { FormProps } from 'antd';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormLink, FormTitle } from '~/services/constants/styled';
import { isValidPassword } from '~/services/constants/validation';
import AccountAPI from '~/services/actions/account'
import { useGlobalDataContext } from '~/hooks/globalData';
import { PATH } from '~/services/constants/navbarList';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
    confirm?: string;
    username?: string;
    code?: string;
};

const Register = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [emailSend, setEmailSend] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Đăng ký'
    }, [])

    const getCode = async () => {
        setIsLoading(true)
        try {
            const { status } = await AccountAPI.getCode(emailSend)
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Vui lòng kiểm tra gmail của bạn!',
                    duration: 3,
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Gửi email thất bại!',
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
            const check = await AccountAPI.register({
                email: values.email as string,
                name: values.username as string,
                password: values.password as string,
                code: values.code as string
            })
            if (check.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: check.message,
                    duration: 3,
                });
                navigate(PATH.LOGIN)
            } else {
                messageApi.open({
                    type: 'error',
                    content: check.message,
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
        <Form
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: 400 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <FormTitle>Đăng Ký</FormTitle>
            <Form.Item<FieldType>
                label="Tên tài khoản"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên tài khoản của bạn!'
                    },
                    {
                        min: 6,
                        message: 'Tên tài khoản cần ít nhất 6 ký tự'
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[{
                    required: true,
                    message: 'Vui lòng nhập email của bạn!',
                    type: 'email'
                }]}
            >
                <Input value={emailSend} onChange={(e) => setEmailSend(e.target.value)} />
            </Form.Item>

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

            <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
            >
                <Checkbox>Đồng ý với điều khoản của chúng tôi</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Đăng ký
                </Button>
            </Form.Item>

            <FormLink>
                Đã có tài khoản? <Link to={PATH.LOGIN}>Đăng nhập ngay.</Link>
            </FormLink>
        </Form>
    )
}

export default Register