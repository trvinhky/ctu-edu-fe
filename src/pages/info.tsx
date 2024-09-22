import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Flex, Form, Image, Input, Row } from "antd"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { BoxTitle } from "~/services/constants/styled";
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import { isValidPhone } from "~/services/constants/validation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/services/constants/navbarList";
import AccountAPI from '~/services/actions/account'
import ProfileAPI from '~/services/actions/profile'
import { AccountInfo } from "~/services/types/account";
import { useGlobalDataContext } from "~/hooks/globalData";
import type { FormProps } from 'antd';
import dayjs, { Dayjs } from "dayjs";

type FieldType = {
    profile_name: string;
    profile_address?: string;
    profile_phone?: string;
    profile_avatar?: string;
    profile_birthday?: Dayjs;
    profile_info?: string;
};

const Wrapper = styled.div`
    position: relative;
    width: fit-content;
`

const BoxAvatar = styled.div`
width: 200px;
height: 200px;
border-radius: 50%;
overflow: hidden;
`

const Avatar = styled(Image)`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`

const LabelAvatar = styled.label`
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 2px 8px;
    background-color: #f1c40f;
    color: #fff;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
`

const Info = () => {
    const title = 'Thông tin cá nhân'
    const dispatch = useDispatch();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [account, setAccount] = useState<AccountInfo>()
    const navigate = useNavigate();
    const [form] = Form.useForm<FieldType>();

    const getInfoAccount = async () => {
        setIsLoading(true)
        try {
            const { data } = await AccountAPI.getOne()
            setIsLoading(false)
            if (data && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setAccount(data)

                const birthday = data.profile.profile_birthday ?
                    dayjs(data.profile.profile_birthday) : undefined
                form.setFieldsValue({
                    profile_name: data.profile.profile_name,
                    profile_address: data.profile.profile_address,
                    profile_phone: data.profile.profile_phone,
                    profile_avatar: data.profile.profile_avatar,
                    profile_birthday: birthday,
                    profile_info: data.profile.profile_info
                })
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
            const res = await ProfileAPI.update({
                profile_Id: account?.profile.profile_Id as string,
                profile_name: values.profile_name,
                profile_address: values.profile_address,
                profile_birthday: values.profile_birthday?.toDate(),
                profile_info: values.profile_info,
                profile_phone: values.profile_phone,
                profile_avatar: values.profile_avatar
            })

            if (res.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: res.message,
                    duration: 3,
                });
                setIsLoading(false)
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.message,
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
        getInfoAccount()
    }, [])

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Form
                form={form}
                style={{ padding: '0 20px' }}
                layout="vertical"
                initialValues={{
                    profile_name: ''
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={[16, 16]}>
                    <Col span={7}>
                        <Wrapper>
                            <BoxAvatar>
                                <Avatar
                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                            </BoxAvatar>
                            <Form.Item<FieldType>
                                name="profile_avatar"
                                style={{ display: 'none' }}
                            >
                                <Input
                                    type="file"
                                    hidden
                                    id="avatar"
                                    accept="image/jpeg,image/png,image/gif"
                                />
                            </Form.Item>
                            <LabelAvatar htmlFor="avatar">
                                <UploadOutlined />
                            </LabelAvatar>
                        </Wrapper>
                    </Col>
                    <Col span={17}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Tên tài khoản"
                                    name="profile_name"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên tài khoản không được trống'
                                        },
                                        {
                                            min: 6,
                                            message: 'Tên tài khoản cần ít nhất 6 ký tự'
                                        }
                                    ]}
                                    style={{ width: '100%' }}
                                >
                                    <Input
                                        placeholder="Tên tài khoản"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="profile_phone"
                                    label="SĐT"
                                    hasFeedback
                                    rules={[
                                        () => ({
                                            validator(_, value) {
                                                if (value && !isValidPhone(value)) {
                                                    return Promise.reject(
                                                        new Error('Số điện thoại không hợp lệ!')
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        placeholder="Số điện thoại"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="profile_birthday"
                                    label="Ngày sinh"
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="Chọn ngày"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    name="profile_address"
                                    label="Địa chỉ"
                                >
                                    <Input
                                        placeholder="Địa chỉ"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    name="profile_info"
                                    label="Giới thiệu"
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Giới thiệu bản thân"
                                    />
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