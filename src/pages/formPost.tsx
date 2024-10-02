import { Button, Flex, Form, FormProps, Input, Select } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import AccountAPI from "~/services/actions/account";
import PostAPI from "~/services/actions/post";
import SubjectAPI from "~/services/actions/subject";
import { BoxTitle } from "~/services/constants/styled";
import { accountInfoSelector } from "~/services/reducers/selectors";
import { Option } from "~/services/types/dataType";
import { Post } from "~/services/types/post";
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import ButtonEdit from "~/services/utils/buttonEdit";

type FieldType = {
    post_title?: string;
    post_content?: string;
    subject_Id?: string;
};

const FormPost = () => {
    const [title, setTitle] = useState('Thêm mới bài đăng')
    const { id } = useParams();
    const [form] = Form.useForm<FieldType>();
    const [contentPost, setContentPost] = useState('');
    const [subjectOption, setSubjectOption] = useState<Option[]>([])
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [accountId, setAccountId] = useState<string>()
    const account = useSelector(accountInfoSelector)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            setTitle(`Cập nhật bài đăng`)
        }
        document.title = title
        getAllSubject(1, 20)
        if (account?.account_Id) {
            setAccountId(account.account_Id)
        } else {
            getInfo()
        }
    }, [id, account])

    const getInfo = async () => {
        try {
            setIsLoading(true)
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setAccountId(data.account_Id)
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const getAllSubject = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll(page, limit)
            if (status === 201 && !Array.isArray(data)) {
                setSubjectOption(
                    data.subjects.map((subject) => {
                        const result: Option = {
                            value: subject.subject_Id as string,
                            label: subject.subject_name
                        }

                        return result
                    })
                )
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

    const resetForm = () => {
        form.resetFields()
        setContentPost('')
    }

    const handleActionBtn = () => {
        if (id) {
            navigate(-1)
        } else {
            resetForm()
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''
            const data: Post = {
                post_content: contentPost as string,
                post_title: values.post_title as string,
                auth_Id: accountId as string,
                subject_Id: values.subject_Id as string
            }
            if (!id) {
                const res = await PostAPI.create(data)
                status = res.status
                message = res.message as string
                resetForm()
            } else {
                const res = await PostAPI.update(data)
                status = res.status
                message = res.message as string
            }

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
                <Form.Item<FieldType>
                    name="subject_Id"
                    label="Môn học"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn môn học!'
                        }
                    ]}
                >
                    <Select
                        options={subjectOption}
                        placeholder="Chọn môn học"
                    />
                </Form.Item>
                <Form.Item<FieldType>
                    name="post_content"
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
                        value={contentPost}
                        onChange={setContentPost}
                        style={{ height: '40vh' }}
                    />
                </Form.Item>
                <Flex
                    justify="flex-end"
                    style={{
                        fontWeight: 600,
                        paddingTop: 40
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