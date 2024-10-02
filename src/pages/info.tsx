import { DollarOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Flex, Form, Image, Input, Row, Tag } from "antd"
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
import { convertUrl } from "~/services/constants";
import avatarImage from '~/assets/images/avatar.jpg'

type FieldType = {
    profile_name: string;
    profile_address?: string;
    profile_phone?: string;
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
    bottom: 10%;
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
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const getInfoAccount = async () => {
        setIsLoading(true)
        try {
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setAccount(data)

                const birthday = data.profile.profile_birthday ?
                    dayjs(data.profile.profile_birthday) : undefined
                form.setFieldsValue({
                    profile_name: data.profile.profile_name,
                    profile_address: data.profile.profile_address,
                    profile_phone: data.profile.profile_phone,
                    profile_birthday: birthday,
                    profile_info: data.profile.profile_info
                })
                setImageSrc(convertUrl(data?.profile.profile_avatar as string))
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
            const profile_birthday = values.profile_birthday?.toDate().toISOString().split('T')[0]
            const data = new FormData()
            data.append('profile_birthday', profile_birthday as string)
            data.append('profile_name', values.profile_name as string)
            data.append('profile_address', values.profile_address as string)
            data.append('profile_info', values.profile_info as string)
            data.append('profile_phone', values.profile_phone as string)
            if (selectedFile) {
                data.append('file', selectedFile)
            }

            const res = await ProfileAPI.update(
                account?.profile.profile_Id as string,
                data
            )

            if (res.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: res.message,
                    duration: 3,
                });
                setIsLoading(false)
                await getInfoAccount()
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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
                                    src={imageSrc?.includes('null') ? avatarImage : imageSrc as string}
                                />
                            </BoxAvatar>
                            <Form.Item
                                name="profile_avatar"
                                style={{ display: 'none' }}
                            >
                                <Input
                                    type="file"
                                    hidden
                                    id="avatar"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleImageUpload}
                                />
                            </Form.Item>
                            <LabelAvatar htmlFor="avatar">
                                <UploadOutlined />
                            </LabelAvatar>
                            <Flex
                                align="center"
                                justify="center"
                                style={{
                                    marginTop: 20
                                }}
                            >
                                <Tag icon={<DollarOutlined />} color="gold" >
                                    0
                                </Tag>
                            </Flex>
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