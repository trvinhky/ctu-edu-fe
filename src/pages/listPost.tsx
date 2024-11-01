import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, FormProps, Input, Pagination, Row } from "antd"
import { useEffect, useState } from "react"
import ItemPost from "~/components/itemPost"
import { useGlobalDataContext } from "~/hooks/globalData"
import PostAPI, { ParamsPost } from "~/services/actions/post"
import { BoxTitle } from "~/services/constants/styled"
import { PostInfo } from "~/services/types/post"

type FieldType = {
    title?: string;
};

const ListPost = () => {
    const title = 'Tất cả bài đăng'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listPosts, setListPosts] = useState<PostInfo[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllPost({
            index: 1,
            page: pagination.current,
            limit: pagination.pageSize
        })
    }, [pagination.current, pagination.pageSize])

    const getAllPost = async (params: ParamsPost) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await PostAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setListPosts(data.posts)
                setPagination({
                    current: params.page ?? 1,
                    pageSize: params.limit ?? 6,
                    total: data.count
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
        await getAllPost({
            page: pagination.current,
            title: values.title,
            index: 1
        })
    }

    const handlePageChange = (newPagination: any) => {
        setPagination(newPagination);
    };

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
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            current={pagination.current}
                            onChange={handlePageChange}
                        />
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export default ListPost