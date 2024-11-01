import { CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, ExclamationCircleFilled, EyeOutlined, FilterOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Input, InputNumber, Modal, Select, Table, TableProps } from "antd";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import PostAPI, { ParamsPost } from "~/services/actions/post";
import StatusAPI from "~/services/actions/status";
import { PATH } from "~/services/constants/navbarList";
import { Title } from "~/services/constants/styled"
import { accountInfoSelector } from "~/services/reducers/selectors";
import { Option } from "~/services/types/dataType";
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom";

type FieldType = {
    subject?: string;
    title?: string;
    status?: string;
};

interface DataType {
    key: string;
    name: string;
    account: string;
    status: string;
    status_index: number;
}

const ManagerPost = ({ isAdmin }: { isAdmin?: boolean }) => {
    const title = 'Danh sách bài đăng'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [statusOptions, setStatusOptions] = useState<Option[]>([])
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [postId, setPostId] = useState<string>('')
    const info = useSelector(accountInfoSelector)
    const [score, setScore] = useState<number | null>(null)
    const navigate = useNavigate();
    const location = useLocation();
    const checkAuth = location.pathname.includes(PATH.AUTH);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllStatus()
        getAllPost({
            page: pagination.current,
            limit: pagination.pageSize
        })
    }, [pagination.current, pagination.pageSize])

    const getAllStatus = async () => {
        setIsLoading(true)
        try {
            const { status, data, message } = await StatusAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                setStatusOptions(
                    data.status.map((item) => {
                        const result: Option = {
                            value: item.status_Id as string,
                            label: item.status_name
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        await getAllPost({
            page: pagination.current,
            status: values.status,
            title: values.title,
            limit: pagination.pageSize
        })
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tên bài đăng',
            dataIndex: 'name',
            key: 'name',
            width: '35%'
        },
        {
            title: 'Tác giả',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Flex
                    align='center'
                    justify='flex-start'
                    gap={10}
                    wrap='wrap'
                >
                    <ButtonLinkCustom
                        href=""
                        shape="default"
                    >
                        <EyeOutlined />
                    </ButtonLinkCustom>
                    {
                        !isAdmin && record.status_index === 0 &&
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: '#fbc531'
                            }}
                        >
                            <Link to={PATH.UPDATE_POST.replace(':id', record.key)}>
                                <FormOutlined />
                            </Link>
                        </Button>
                    }
                    {
                        isAdmin && record.status_index === 0 &&
                        <>
                            <Button
                                type="primary"
                                onClick={() => handleShowModel(record.key)}
                                style={{
                                    backgroundColor: '#2ecc71'
                                }}
                            >
                                <CheckCircleOutlined />
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => handleCancelPost(record.key)}
                                style={{
                                    backgroundColor: '#c0392b'
                                }}
                            >
                                <CloseCircleOutlined />
                            </Button>
                        </>
                    }
                </Flex>
            ),
        },
    ];

    const handleShowModel = async (id: string) => {
        setPostId(id)
        setIsOpenModal(true)
    }

    const handleCancelPost = async (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn hủy bài đăng này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                await handleChangeStatus(id, -1)
            },
            onCancel() { },
        });
    }

    const getAllPost = async (params: ParamsPost) => {
        setIsLoading(true)
        try {
            const allParams = { ...params }
            if (checkAuth) {
                if (info) {
                    allParams.account = info.account_Id
                } else {
                    navigate(PATH.LOGIN)
                }
            }
            const { data, status, message } = await PostAPI.getAll(allParams)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.posts.map((post) => {
                        const result: DataType = {
                            key: post.post_Id as string,
                            account: post.account.profile.profile_name,
                            name: post.post_title,
                            status: post?.status?.status_name as string,
                            status_index: post.status.status_index
                        }

                        return result
                    })
                )
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

    const handleChangeStatus = async (post_Id: string, status_index: 1 | 0 | -1) => {
        if (score === null && status_index === 1) return
        setIsLoading(true)
        try {
            const { status, message } = await PostAPI.updateStatus(
                post_Id,
                status_index,
                score as number
            )
            if (status === 200) {
                await getAllPost({
                    page: pagination.current,
                    limit: pagination.pageSize
                })
                setScore(null)
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

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const handleModalOK = async () => {
        handleChangeStatus(postId, 1)
        setIsOpenModal(false)
    }

    return (
        <>
            <Title>{title}</Title>
            <Form
                initialValues={{}}
                onFinish={onFinish}
            >
                <Flex
                    align='center'
                    justify='flex-end'
                    gap={10}
                    style={{ marginBottom: '15px', width: '100%' }}
                >
                    <Form.Item<FieldType>
                        name="title"
                        style={{
                            marginBottom: 0,
                            flex: 1
                        }}
                    >
                        <Input placeholder='Tên bài đăng...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="status"
                        style={{ marginBottom: 0, width: '25%' }}
                    >
                        <Select
                            options={statusOptions}
                            placeholder="Chọn trạng thái"
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
            <Table
                columns={columns}
                dataSource={dataTable}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="key"
            />
            <Modal
                title="Duyệt bài đăng"
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                onOk={handleModalOK}
                cancelText="Thoát"
            >
                <InputNumber
                    min={0}
                    addonAfter={<DollarOutlined />}
                    required
                    value={score}
                    onChange={(value) => setScore(value)}
                />
            </Modal>
        </>
    )
}

export default ManagerPost