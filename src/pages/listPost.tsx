import { FilterOutlined } from "@ant-design/icons"
import { Button, Col, DatePicker, Flex, Form, FormProps, Input, Pagination, Row } from "antd"
import { Dayjs } from "dayjs"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import ItemPost from "~/components/itemPost"
import { useGlobalDataContext } from "~/hooks/globalData"
import PostAPI, { ParamsPost } from "~/services/actions/post"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"
import { PostInfo } from "~/services/types/post"

type FieldType = {
    title?: string;
    date?: Dayjs
    auth?: string
};

const ListPost = () => {
    const title = 'Tất cả bài đăng'
    const [searchParams] = useSearchParams()
    const { setIsLoading } = useGlobalDataContext();
    const [listPosts, setListPosts] = useState<PostInfo[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });
    const navigate = useNavigate();
    // Lấy giá trị query
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const titlePost = searchParams.get("title");
    const auth = searchParams.get("auth");

    useEffect(() => {
        document.title = title
        const params: ParamsPost = {
            index: 1,
            page: pagination.current,
            limit: pagination.pageSize
        }
        if (auth) params.auth = auth
        if (year) params.year = +year
        if (month) params.month = +month
        if (titlePost) params.title = titlePost
        getAllPost(params)
    }, [pagination.current, pagination.pageSize, auth, year, month, titlePost])

    const getAllPost = async (params: ParamsPost) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await PostAPI.getAll(params)
            if (status === 201) {
                setListPosts(data.posts)
                setPagination({
                    current: params.page ?? 1,
                    pageSize: params.limit ?? 6,
                    total: data.count
                })
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        let url = PATH.LIST_POST + '?'

        if (values.title) {
            url += `title=${values.title}`
        }

        if (values.auth) {
            url += `&auth=${values.auth}`
        }

        const date = values.date?.toDate()
        if (date) {
            url += `&month=${date.getMonth() + 1}&year=${date.getFullYear()}`
        }

        navigate(url)
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
                    <Form.Item<FieldType>
                        name="auth"
                        style={{
                            marginBottom: 0,
                            width: '50%',
                        }}
                    >
                        <Input placeholder='Tác giả...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="date"
                        style={{
                            marginBottom: 0,
                            width: '30%',
                        }}
                    >
                        <DatePicker
                            picker="month"
                            format={"MM-YYYY"}
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        <FilterOutlined />
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