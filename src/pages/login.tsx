import type { FormProps } from 'antd';
import { Button, Flex, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalDataContext } from '~/hooks/globalData';
import useCaptcha from '~/hooks/useCaptcha';
import AccountAPI from '~/services/actions/account'
import { PATH } from '~/services/constants/navbarList';
import { FormLink, FormTitle, ImgCaptCha } from '~/services/constants/styled';
import { actions as actionsAccount } from '~/services/reducers/accountSlice';

type FieldType = {
    email?: string;
    password?: string;
    captcha?: string;
};

const Login = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [captchaUrl] = useCaptcha()
    const title = 'Đăng nhập'

    useEffect(() => {
        document.title = title
    }, [])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
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
                navigate(PATH.HOME)
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
        <Form
            name="login"
            style={{ width: 400 }}
            initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout='vertical'
        >
            <FormTitle>{title}</FormTitle>
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
            <Flex
                justify='flex-start'
                gap={20}
                style={{
                    paddingBottom: 30,
                    paddingTop: 10
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
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Đăng Nhập
                </Button>
            </Form.Item>

            <Flex align='center' justify='space-between'>
                <Link to={PATH.FORGOT}>Quên mật khẩu</Link>
                <FormLink>
                    Chưa có tài khoản? <Link to={PATH.REGISTER}>Đăng ký ngay.</Link>
                </FormLink>
            </Flex>
        </Form>
    )
}

export default Login