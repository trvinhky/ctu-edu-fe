import { DollarOutlined } from "@ant-design/icons";
import { Form, FormProps, Input, Modal, Select, Button, InputNumber } from "antd"
import React, { useEffect, useState } from "react"
import { useGlobalDataContext } from "~/hooks/globalData";
import CategoryAPI from "~/services/actions/category";
import QuestionResourceAPI from "~/services/actions/question_resource";
import ResourceAPI from "~/services/actions/resource";
import { CategoryInfo } from "~/services/types/category";
import { Option } from "~/services/types/dataType"

type FieldType = {
    category_Id?: string
    resource_score?: number
};

interface FromProps {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    isLesson?: boolean
    getAllResources: (idFind: string) => Promise<void>
    id: string
}

const FormResource = ({ isModalOpen, setIsModalOpen, isLesson, getAllResources, id }: FromProps) => {
    const [form] = Form.useForm<FieldType>();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [acceptFile, setAcceptFile] = useState<string | undefined>()
    const [categories, setCategories] = useState<CategoryInfo[]>()


    useEffect(() => {
        getAllCategory()
    }, [])
    const [optionCategory, setOptionCategory] = useState<Option[]>()

    const getAllCategory = async () => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CategoryAPI.getAll(1, 20)
            if (status === 201 && !Array.isArray(data)) {
                setOptionCategory(
                    data.categories.map((category) => {
                        const result: Option = {
                            label: category.category_description,
                            value: category.category_Id as string
                        }

                        return result
                    })
                )
                setCategories(data.categories)
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

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''
            const formData = new FormData()
            if (selectedFile) {
                formData.append('file', selectedFile)
            }
            formData.append('category_Id', values.category_Id as string)

            if (!isLesson) {
                formData.append('question_Id', id as string)
                const res = await QuestionResourceAPI.create(formData)
                status = res.status
                message = res.message as string
            } else {
                formData.append('lesson_Id', id as string)
                formData.append('resource_score', JSON.stringify(values.resource_score))
                const res = await ResourceAPI.create(formData)
                status = res.status
                message = res.message as string
            }

            if (status === 200) {
                await getAllResources(id)
            }
            form.resetFields()
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

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader();
            reader.readAsDataURL(file);
        }
    };

    const handleChangeOption = (value: string) => {
        const data = categories?.find((category) => category.category_Id === value)
        setAcceptFile(data?.category_accept)
    };

    return (
        <Form
            name="resource"
            layout="vertical"
            onFinish={onFinish}
            form={form}
            initialValues={{ resource_score: 0 }}
        >
            <Modal
                title="Thêm file mới"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button
                        key="back"
                        onClick={handleCancel}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        htmlType="submit"
                        form="resource"
                    >
                        Thêm
                    </Button>,
                ]}
            >
                <Form.Item<FieldType>
                    label="Loại file"
                    name="category_Id"
                    style={{ width: '100%' }}
                >
                    <Select
                        options={optionCategory}
                        placeholder="chọn loại file"
                        onChange={handleChangeOption}
                    />
                </Form.Item>
                <Form.Item
                    label="Chọn file"
                    name="resource_url"
                >
                    <Input
                        type="file"
                        onChange={handleUpload}
                        accept={acceptFile}
                    />
                </Form.Item>
                {
                    isLesson &&
                    <Form.Item<FieldType>
                        name="resource_score"
                        label="Số điểm"
                    >
                        <InputNumber addonAfter={<DollarOutlined />} />
                    </Form.Item>
                }
            </Modal>
        </Form>
    )
}

export default FormResource