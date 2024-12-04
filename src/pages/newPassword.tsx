import { useEffect } from "react"
import { FormTitle } from "~/services/constants/styled"
import { Button, Col, Form, Input, Row } from 'antd';
import type { FormProps } from 'antd';
import { useGlobalDataContext } from "~/hooks/globalData";
import { isValidPassword } from "~/services/constants/validation";
import AccountAPI from '~/services/actions/account'
import { useNavigate } from "react-router-dom";
import { PATH } from "~/services/constants/navbarList";
import { toast } from "react-toastify";

type FieldType = {
    password?: string;
    confirm?: string;
    code?: string;
};

const NewPassword = () => {
    const title = 'Đổi mật khẩu'
    const { setIsLoading, emailSend } = useGlobalDataContext();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = title
    }, [])

    const getCode = async () => {
        setIsLoading(true)
        try {
            if (emailSend) {
                const { status, message } = await AccountAPI.getCode(emailSend)

                if (status === 200) toast.success(message)
                else toast.error(message)

                return
            }
            setIsLoading(false)
            navigate(PATH.LOGIN)
            return
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
            setIsLoading(false)
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)

        try {
            const { status, message } = await AccountAPI.forgotPassword({
                email: emailSend as string,
                password: values.password as string,
                code: values.code as string
            })

            if (status === 200) {
                navigate(PATH.LOGIN)
                toast.success(message)
            }
            else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
        toast.warning('Vui lòng nhập đầy đủ dữ liệu!')
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