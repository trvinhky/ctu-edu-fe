import type { FormInstance, FormProps } from 'antd';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useGlobalDataContext } from '~/hooks/globalData';
import { Title } from '~/services/constants/styled';
import { isValidPassword } from '~/services/constants/validation';
import AccountAPI from '~/services/actions/account'
import { ROLE_OPTIONS } from '~/services/constants';
import { toast } from 'react-toastify';

interface SubmitButtonProps {
    form: FormInstance;
}

type FieldType = {
    username?: string;
    password?: string;
    role?: boolean;
    email?: string;
    code?: string;
};

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children }) => {
    const [submittable, setSubmittable] = useState<boolean>(false);

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable}>
            {children}
        </Button>
    );
};

const CreateAccount = () => {
    const title = 'Tạo tài khoản'
    const { setIsLoading } = useGlobalDataContext();
    const [emailSend, setEmailSend] = useState('')

    const getCode = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await AccountAPI.getCode(emailSend)

            if (status === 200) toast.success(message)
            else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const [form] = Form.useForm<FieldType>();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)

        try {
            const { status, message } = await AccountAPI.register({
                email: values.email as string,
                name: values.username as string,
                password: values.password as string,
                code: values.code as string,
                isAdmin: values.role
            })

            if (status === 200) {
                toast.success(message)
                form.resetFields()
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }

        setIsLoading(false)
    };

    useEffect(() => {
        document.title = title
    }, [])

    return (
        <section className="create-account">
            <Title>{title}</Title>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
                style={{ width: '80%' }}
                initialValues={{}}
            >
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Form.Item<FieldType>
                            name="username"
                            label="Tên tài khoản"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên tài khoản!'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item<FieldType>
                            label="Role"
                            name="role"
                        >
                            <Select
                                options={ROLE_OPTIONS}
                                placeholder="Chọn role"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item<FieldType>
                    name="email"
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Vui lòng nhập đúng E-mail!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập E-mail!',
                        },
                    ]}
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
                                if (isValidPassword(value)) {
                                    return Promise.resolve();
                                }
                                return Promise
                                    .reject(
                                        new Error('Mật khẩu không đủ mạnh!')
                                    );
                            }
                        })
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

                <Form.Item>
                    <Space>
                        <SubmitButton form={form}>
                            Thêm
                        </SubmitButton>
                        <Button htmlType="reset">
                            Làm mới
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </section>
    )
}

export default CreateAccount