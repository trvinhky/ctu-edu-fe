import type { FormInstance, FormProps } from 'antd';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useGlobalDataContext } from '~/hooks/globalData';
import { Title } from '~/services/constants/styled';
import { isValidPassword } from '~/services/constants/validation';
import { AccountRegister } from '~/services/types/account';
import AccountAPI from '~/services/actions/account'
import RoleAPI from '~/services/actions/role';
import { Option } from '~/services/types/dataType';

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
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [roles, setRoles] = useState<Option[]>([])

    const getAllRole = async () => {
        setIsLoading(true)
        try {
            const { data, message } = await RoleAPI.getAll()
            if (data && Array.isArray(data)) {
                const result: Option[] = data.map((item) => ({
                    label: item.role_name,
                    value: item.role_Id as string
                }))
                setRoles(result)
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

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        const data: AccountRegister = {
            email: values.email as string,
            password: values.password as string,
            name: values.username as string,
            role: values.role as string,
            code: ''
        }

        try {
            const check = await AccountAPI.register(data)
            if (check.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: check.message,
                    duration: 3,
                });
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

    useEffect(() => {
        document.title = title
        getAllRole()
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
                                options={roles}
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