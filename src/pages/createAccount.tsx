import type { FormInstance } from 'antd';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Title } from '~/services/constants/styled';
import { isValidPassword } from '~/services/constants/validation';

interface SubmitButtonProps {
    form: FormInstance;
}

type FieldType = {
    username?: string;
    password?: string;
    role?: string;
    email?: string;
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
    useEffect(() => {
        document.title = title
    }, [])
    const [form] = Form.useForm();

    return (
        <section className="create-account">
            <Title>{title}</Title>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
                style={{ width: '80%' }}
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
                                defaultValue="lucy"
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                    { value: 'lucy', label: 'Lucy' }
                                ]}
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