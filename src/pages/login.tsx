import type { FormProps } from 'antd';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormLink, FormTitle } from '~/services/constants/styled';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};

const Login = () => {
    useEffect(() => {
        document.title = 'Đăng nhập'
    }, [])

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="login"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: 400 }}
            initialValues={{ remember: true, role: 1 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <FormTitle>Đăng Nhập</FormTitle>
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
                rules={[{
                    required: true,
                    message: 'Vui lòng nhập mật khẩu!'
                }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
            >
                <Checkbox>Ghi nhớ cho lần đăng nhập tiếp theo</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Đăng Nhập
                </Button>
            </Form.Item>

            <Flex align='center' justify='space-between'>
                <Link to=''>Quên mật khẩu</Link>
                <FormLink>
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay.</Link>
                </FormLink>
            </Flex>
        </Form>
    )
}

export default Login