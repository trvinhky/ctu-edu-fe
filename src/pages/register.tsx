import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormLink, FormTitle } from '~/services/constants/styled';
import { isValidPassword } from '~/services/constants/validation';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
    confirm?: string;
    username?: string;
};

const Register = () => {
    useEffect(() => {
        document.title = 'Đăng ký'
    }, [])

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                <Input />
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
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay.</Link>
            </FormLink>
        </Form>
    )
}

export default Register