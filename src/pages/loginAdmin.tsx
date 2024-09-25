import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, FormProps } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import AccountAPI from '~/services/actions/account'
import { useGlobalDataContext } from '~/hooks/globalData';
import { useDispatch } from 'react-redux';
import { PATH } from '~/services/constants/navbarList';
import { FormTitle, ImgCaptCha } from '~/services/constants/styled';
import useCaptcha from '~/hooks/useCaptcha';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
    captcha?: string;
};

const LoginAdmin = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [captchaUrl] = useCaptcha()
    const title = 'Đăng nhập admin'

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {
        setIsLoading(true)
        try {
            const { data, message } = await AccountAPI.login({
                email: values.email as string,
                password: values.password as string,
                captcha: values.captcha as string
            })

            if (data && !Array.isArray(data)) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                setIsLoading(false)
                dispatch(actionsAccount.LoginAccount(data.token))
                navigate(PATH.ADMIN)
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

    useEffect(() => {
        document.title = title
    }, [])

    return (
        <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ width: 400 }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <FormTitle>{title}</FormTitle>
            <Form.Item<FieldType>
                name="email"
                rules={[{
                    required: true,
                    message: 'Vui lòng nhập email của bạn!',
                    type: 'email'
                }]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item<FieldType>
                name="password"
                rules={[{
                    required: true,
                    message: 'Vui lòng nhập mật khẩu!'
                }]}
            >
                <Input prefix={<LockOutlined />} type="password" placeholder="Mật khẩu" />
            </Form.Item>

            <Flex
                justify='flex-start'
                gap={20}
                style={{
                    paddingBottom: 30,
                }}
            >
                <Form.Item<FieldType>
                    name="captcha"
                    noStyle
                    rules={[{ required: true, message: 'Vui lòng nhập captcha!' }]}
                >
                    <Input />
                </Form.Item>
                {captchaUrl && <ImgCaptCha src={captchaUrl} alt="CAPTCHA" />}
            </Flex>

            <Form.Item>
                <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Ghi nhớ cho lần sau</Checkbox>
                    </Form.Item>
                    <Link to={PATH.FORGOT}>Quên mật khẩu</Link>
                </Flex>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    )
}

export default LoginAdmin