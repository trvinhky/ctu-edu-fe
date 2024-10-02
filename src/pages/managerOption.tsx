import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, FormProps, Input, Modal, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import OptionAPI from "~/services/actions/option";
import { BoxTitle } from "~/services/constants/styled"
import { Option } from "~/services/types/option";
import ButtonBack from "~/services/utils/buttonBack";
import ButtonDelete from "~/services/utils/buttonDelete";
import ButtonEdit from "~/services/utils/buttonEdit";

type FieldType = {
    option_content?: string
    option_is_correct: boolean
};

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const BoxOption = styled.div<{ $isCorrect?: boolean; }>`
    padding: 15px;
    border-radius: 5px;
    border: 1px solid;
    border-color: ${props => props.$isCorrect ? "#2ecc71" : "rgb(0, 0, 0, 0.1)"};
`

const ManagerOption = () => {
    const title = 'Danh sách câu trả lời'
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const [form] = Form.useForm<FieldType>();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [idOption, setIdOption] = useState<string>()
    const [listOptions, setListOptions] = useState<Option[]>([])

    useEffect(() => {
        document.title = title
        if (id) {
            getAllOptions(id)
        } else navigate(-1)
    }, [id])

    const showModel = async (target?: string) => {
        if (target) {
            setIdOption(target)
            await getOneOption(target)
        }
        setIsModalOpen(true)
    }

    const getAllOptions = async (questionId: string) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await OptionAPI.getAll(questionId)
            if (status === 201 && !Array.isArray(data)) {
                setListOptions(data.options)
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

    const getOneOption = async (optId: string) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await OptionAPI.getOne(optId)
            if (status === 201 && !Array.isArray(data)) {
                form.setFieldsValue({
                    option_content: data.option_content,
                    option_is_correct: data.option_is_correct
                })
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 400
            let message: string = ''
            if (id && values.option_content) {
                const data: Option = {
                    option_content: values.option_content,
                    option_is_correct: values.option_is_correct,
                    question_Id: id,
                    option_Id: idOption as string
                }
                if (!idOption) {
                    const res = await OptionAPI.create(data)
                    status = res.status
                    message = res.message as string
                    form.resetFields()
                } else {
                    const res = await OptionAPI.update(data)
                    status = res.status
                    message = res.message as string
                }
            }

            await getAllOptions(id as string)
            messageApi.open({
                type: status === 200 ? 'success' : 'error',
                content: message,
                duration: 3,
            });
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const confirmDelete = async (idTarget: string) => {
        setIsLoading(true)
        try {
            const { message, status } = await OptionAPI.delete(idTarget)
            if (status === 200) await getAllOptions(id as string)
            messageApi.open({
                type: status === 200 ? 'success' : 'error',
                content: message,
                duration: 3,
            });
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    const showPromiseConfirm = (idTarget: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa câu trả lời này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(idTarget)
            },
            onCancel() { },
        });
    };

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex
                align='center'
                justify='space-between'
                gap={10}
                style={{ marginBottom: '15px' }}
            >
                <ButtonBack />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={() => showModel()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Form
                layout="vertical"
                name="option"
                form={form}
                onFinish={onFinish}
                initialValues={{ option_is_correct: false }}
            >
                <Modal
                    title={`${idOption ? 'Cập nhật' : 'Thêm'} câu trả lời`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <React.Fragment key="action">
                            {
                                idOption ?
                                    <WrapperBtn onClick={handleOk}>
                                        <ButtonEdit text="Cập nhật" htmlType="submit" form="option" />
                                    </WrapperBtn>
                                    :
                                    <Button type="primary" onClick={handleOk} htmlType="submit" form="option">
                                        Thêm
                                    </Button>
                            }
                        </React.Fragment>
                    ]}
                >
                    <Form.Item<FieldType>
                        name="option_content"
                        label="Nội dung"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Flex
                        align="center"
                        justify="center"
                    >
                        <Form.Item<FieldType>
                            name="option_is_correct"
                        >
                            <Radio.Group>
                                <Radio value={true}> Đúng </Radio>
                                <Radio value={false}> Sai </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Flex>
                </Modal>
            </Form>
            <Row gutter={[16, 16]}>
                {
                    listOptions?.map((opt) => (
                        <Col span={8} key={opt.option_Id}>
                            <BoxOption $isCorrect={opt.option_is_correct}>
                                <Flex justify="flex-end" gap={10}>
                                    <div onClick={() => showModel(opt.option_Id as string)}>
                                        <ButtonEdit />
                                    </div>
                                    <div onClick={() => showPromiseConfirm(opt.option_Id as string)}>
                                        <ButtonDelete />
                                    </div>
                                </Flex>
                                <p>{opt.option_content}</p>
                            </BoxOption>
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default ManagerOption