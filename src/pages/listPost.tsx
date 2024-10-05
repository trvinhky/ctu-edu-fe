import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, FormProps, Input, Pagination, Row, Select } from "antd"
import { useEffect, useState } from "react"
import ItemPost from "~/components/itemPost"
import { useGlobalDataContext } from "~/hooks/globalData"
import PostAPI, { ParamsAll } from "~/services/actions/post"
import SubjectAPI from "~/services/actions/subject"
import { BoxTitle } from "~/services/constants/styled"
import { Option } from "~/services/types/dataType"
import { PostInfo } from "~/services/types/post"

type FieldType = {
    subject?: string;
    title?: string;
};

const ListPost = () => {
    const title = 'Tất cả bài đăng'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listPosts, setListPosts] = useState<PostInfo[]>([])
    const [subjectOptions, setSubjectOptions] = useState<Option[]>([])

    useEffect(() => {
        document.title = title
        getAllSubject()
        getAllPost({})
    }, [])

    const getAllSubject = async () => {
        document.title = title
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                setSubjectOptions(
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

    const getAllPost = async (params: ParamsAll) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await PostAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setListPosts(data.posts)
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
        await getAllPost({ page: 1, subject: values.subject, title: values.title })
    }

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Form
                style={{ paddingBottom: '10px' }}
                onFinish={onFinish}
            >
                <Flex
                    align='center'
                    justify='flex-end'
                    gap={10}
                    style={{ marginBottom: '15px' }}
                >
                    <Form.Item<FieldType>
                        name="title"
                        style={{
                            marginBottom: 0,
                            width: '100%',
                        }}
                    >
                        <Input placeholder='Tiêu đề bài viết...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="subject"
                        style={{ marginBottom: 0, width: '40%' }}
                    >
                        <Select
                            style={{ width: "100%" }}
                            placeholder="chọn môn học"
                            options={subjectOptions}
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                    >
                        <SearchOutlined />
                    </Button>
                </Flex>
            </Form>
            <Row gutter={[16, 16]}>
                {
                    listPosts?.map((post) => (
                        <Col span={12} key={post.post_Id}>
                            <ItemPost data={post} />
                        </Col>
                    ))
                }
                <Col span={24}>
                    <Flex
                        align='center'
                        justify='center'
                        style={{ paddingTop: '10px' }}
                    >
                        <Pagination
                            defaultCurrent={1}
                            total={50}
                        />
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export default ListPost