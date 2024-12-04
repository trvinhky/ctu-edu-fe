import { DollarOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Input, Row, Tag } from "antd"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { BoxTitle } from "~/services/constants/styled";
import { isValidPassword } from "~/services/constants/validation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/services/constants/navbarList";
import AccountAPI from '~/services/actions/account'
import { useGlobalDataContext } from "~/hooks/globalData";
import type { FormProps } from 'antd';
import { setInfo } from "~/services/reducers/accountSlice";
import { Account } from "~/services/types/account";
import { toast } from "react-toastify";

type FieldType = {
    password?: string;
    confirm?: string;
    code?: string;
};

const TitleSub = styled.div`
    font-weight: 600;
    border-left: 2px solid #f1c40f;
    padding-left: 10px;
    font-size: 20px;
    color: #000;
    display: inline-block;
    margin: 30px 0 20px;
`

const TextTitle = styled.span`
    font-weight: 600;
    white-space: nowrap;
`

const Info = () => {
    const title = 'Thông tin cá nhân'
    const { setIsLoading } = useGlobalDataContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm<FieldType>();
    const [accountName, setAccountName] = useState<string>()
    const [account, setAccount] = useState<Account>()

    const getInfoAccount = async () => {
        setIsLoading(true)
        try {
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201) {
                dispatch(setInfo(data))
                setAccountName(data.account_name)
                setAccount(data)
            } else {
                navigate(PATH.LOGIN)
            }
        } catch (e) {
            setIsLoading(false)
            navigate(PATH.LOGIN)
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            const { status, message } = await AccountAPI.changePassword(
                values.password as string,
                values.code as string
            )

            if (status === 200) {
                toast.success(message)
                setIsLoading(false)
                await getInfoAccount()
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }

        setIsLoading(false)
    };

    useEffect(() => {
        document.title = title
        getInfoAccount()
    }, [])

    const getCode = async () => {
        setIsLoading(true)
        try {
            if (account?.account_email) {
                const { status } = await AccountAPI.getCode(account.account_email)
                setIsLoading(false)

                if (status === 200) toast.success('Vui lòng kiểm tra gmail của bạn!')
                else toast.error('Vui lòng kiểm tra gmail của bạn!')
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const handleUpdateName = async () => {
        if (accountName) {
            setIsLoading(true)
            try {
                const { message, status } = await AccountAPI.changeName(accountName)
                setIsLoading(false)

                if (status === 200) toast.success(message)
                else toast.error(message)
            } catch (e) {
                setIsLoading(false)
                toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
            }
        }
    }

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <TitleSub>
                Thông tin cơ bản
            </TitleSub>
            <div>
                <Flex gap={5} align="center">
                    <TextTitle>Tên tài khoản: </TextTitle>
                    <Input
                        addonAfter={
                            <EditOutlined
                                onClick={handleUpdateName}
                                style={{ cursor: 'pointer' }}
                            />
                        }
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                    />
                </Flex>
                <Flex gap={5} align="center" style={{ paddingTop: 15 }}>
                    <TextTitle>Điểm tích lũy:</TextTitle>
                    <Tag icon={<DollarOutlined />} color="gold" >
                        {account?.account_score}
                    </Tag>
                </Flex>
            </div>
            <TitleSub>
                Thay đổi mật khẩu
            </TitleSub>
            <Form
                form={form}
                style={{ padding: '0 20px' }}
                layout="vertical"
                initialValues={[]}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
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
                            </Col>
                            <Col span={12}>
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
                            </Col>
                            <Col span={12}>
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
                            </Col>

                            <Col span={24}>
                                <Flex justify="flex-end">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            backgroundColor: '#f1c40f',
                                            fontWeight: 600
                                        }}
                                    >
                                        Cập nhật
                                    </Button>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default Info