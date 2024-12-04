import { Button, Col, Flex, Form, FormProps, Input, InputNumber, Row, Select, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import PostAPI from "~/services/actions/post";
import { BoxTitle } from "~/services/constants/styled";
import { accountInfoSelector } from "~/services/reducers/selectors";
import { Option } from "~/services/types/dataType";
import ButtonEdit from "~/services/utils/buttonEdit";
import FormatAPI from "~/services/actions/format";
import { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { FormatInfo } from "~/services/types/format";
import { toast } from "react-toastify";

type FieldType = {
    post_title?: string;
    format_Id?: string;
    post_year?: number;
    post_author?: string;
};

const FormPost = () => {
    const [title, setTitle] = useState('Thêm mới bài đăng')
    const { id } = useParams();
    const [form] = Form.useForm<FieldType>();
    const [contentPost, setContentPost] = useState('');
    const [formatOption, setFormatOption] = useState<Option[]>([])
    const { setIsLoading } = useGlobalDataContext();
    const [accountId, setAccountId] = useState<string>()
    const account = useSelector(accountInfoSelector)
    const [statusId, setStatusId] = useState<string>()
    const navigate = useNavigate()
    const [acceptFile, setAcceptFile] = useState<string | undefined>()
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [formats, setFormats] = useState<FormatInfo[]>()

    useEffect(() => {
        if (id) {
            setTitle(`Cập nhật bài đăng`)
            getOnePost(id)
        }
        document.title = title
        getAllFormat()
        if (account?.account_Id) {
            setAccountId(account.account_Id)
        }
    }, [id, account])

    const getOnePost = async (postId: string) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await PostAPI.getOne(postId)
            if (status === 201) {
                form.setFieldsValue({
                    post_title: data.post_title,
                    format_Id: data.format_Id,
                    post_author: data.post_author,
                    post_year: data.post_year
                })
                setContentPost(data.post_content)
                setStatusId(data.status_Id)
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const getAllFormat = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await FormatAPI.getAll(page, limit)
            if (status === 201) {
                setFormatOption(
                    data.formats.map((format) => {
                        const result: Option = {
                            value: format.format_Id as string,
                            label: format.format_description
                        }

                        return result
                    })
                )
                setFormats(data.formats)
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const resetForm = () => {
        form.resetFields()
        setContentPost('')
        setFileList([])
    }

    const handleActionBtn = () => {
        if (id) {
            navigate(-1)
        } else {
            resetForm()
        }
    }

    const handleChangeOption = (value: string) => {
        const data = formats?.find((format) => format.format_Id === value)
        setAcceptFile(data?.format_accept)
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''
            if (!id) {
                const data = new FormData()

                data.append('post_title', values.post_title as string)
                data.append('post_content', contentPost as string)
                data.append('account_Id', accountId as string)
                data.append('format_Id', values.format_Id as string)
                data.append('post_author', values.post_author as string)
                data.append('post_year', (values.post_year as number).toString())
                if (fileList.length > 0) {
                    const file = fileList[0].originFileObj as File;
                    data.append("file", file);
                }

                const res = await PostAPI.create(data)
                status = res.status
                message = res.message as string
                resetForm()
            } else {
                const res = await PostAPI.update({
                    post_content: contentPost as string,
                    post_title: values.post_title as string,
                    status_Id: statusId as string,
                    post_author: values.post_author as string,
                    post_year: values.post_year as number
                })
                status = res.status
                message = res.message as string
            }

            if (status === 200) toast.success(message)
            else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const handleBeforeUpload = (file: RcFile) => {
        if (!form.getFieldValue('format_Id')) {
            return false
        }

        // Nếu fileList đã có file, không cho phép chọn thêm
        if (fileList.length >= 1) {
            return Upload.LIST_IGNORE;
        }

        // Cập nhật fileList với file mới
        setFileList([file]);
        return false; // Ngăn việc tự động upload
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (form.getFieldValue('format_Id'))
            setFileList(newFileList);
    }

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Form
                form={form}
                name="post"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
                style={{ width: '100%' }}
                initialValues={{}}
            >
                <Form.Item<FieldType>
                    name="post_title"
                    label="Tiêu đề"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tiêu đề!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            name="post_author"
                            label="Tác giả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tác giả!'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            name="post_year"
                            label="Năm xuất bản"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập năm xuất bản!'
                                }
                            ]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="Nội dung"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập nội dung!'
                        }
                    ]}
                >
                    <ReactQuill
                        theme="snow"
                        style={{ height: '40vh' }}
                        value={contentPost}
                        onChange={setContentPost}
                    />
                </Form.Item>
                {
                    !id &&
                    <Row gutter={[16, 16]} style={{ paddingTop: 40 }}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                name="format_Id"
                                label="Định dạng"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng định dạng file!'
                                    }
                                ]}
                            >
                                <Select
                                    options={formatOption}
                                    onChange={handleChangeOption}
                                    placeholder="Chọn định dạng file"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="files"
                                label="Chọn file"
                                required
                            >
                                <Upload
                                    listType="text"
                                    maxCount={1}
                                    fileList={fileList}
                                    beforeUpload={handleBeforeUpload}
                                    accept={acceptFile}
                                    onRemove={() => setFileList([])}
                                    onChange={handleChange}
                                >
                                    {
                                        fileList.length === 0 &&
                                        <Button icon={<UploadOutlined />}>
                                            Chọn file theo loại
                                        </Button>
                                    }
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                }
                <Flex
                    justify="flex-end"
                    style={{
                        fontWeight: 600,
                        paddingTop: 15
                    }}
                    gap={10}
                >
                    <Button onClick={handleActionBtn}>
                        {id ? 'Thoát' : 'Làm mới'}
                    </Button>
                    {
                        id ?
                            <ButtonEdit
                                text="Cập nhật"
                                htmlType="submit"
                            /> :
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                Tạo mới
                            </Button>
                    }
                </Flex>
            </Form>
        </>
    )
}

export default FormPost