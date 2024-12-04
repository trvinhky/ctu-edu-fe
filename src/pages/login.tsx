import { RedoOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGlobalDataContext } from '~/hooks/globalData';
import AccountAPI from '~/services/actions/account'
import { ENV } from '~/services/constants';
import { PATH } from '~/services/constants/navbarList';
import { FormLink, FormTitle, ImgCaptCha } from '~/services/constants/styled';
import { loginAccount } from '~/services/reducers/accountSlice';

type FieldType = {
    email?: string;
    password?: string;
    captcha?: string;
};

const Login = () => {
    const { setIsLoading } = useGlobalDataContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [captchaUrl, setCaptchaUrl] = useState<string | undefined>(undefined)
    const title = 'Đăng nhập'

    useEffect(() => {
        document.title = title
        fetchCaptcha()
    }, [])

    const fetchCaptcha = async () => {
        setIsLoading(true)
        try {
            const { data } = await AccountAPI.getCaptCha()

            if (!Array.isArray(data)) {
                setCaptchaUrl(`${ENV.BE_HOST}${data.url}`);
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await AccountAPI.login({
                email: values.email as string,
                password: values.password as string,
                captcha: values.captcha as string
            })

            if (status === 201) {
                toast.success(message)
                setIsLoading(false)
                dispatch(loginAccount(data.token))
                navigate(PATH.HOME)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
        toast.warning('Vui lòng nhập đầy đủ dữ liệu!')
    };

    const handleReloadCaptcha = async () => {
        await fetchCaptcha()
    }

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
                gap={15}
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
                {captchaUrl &&
                    <Flex gap={10}>
                        <ImgCaptCha src={captchaUrl} alt="CAPTCHA" style={{ borderRadius: 5 }} />
                        <Button
                            type='primary'
                            style={{ height: '40px', backgroundColor: '#2c3e50' }}
                            onClick={handleReloadCaptcha}
                        >
                            <RedoOutlined />
                        </Button>
                    </Flex>
                }
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