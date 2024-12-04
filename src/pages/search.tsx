import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, FormProps, Input, Pagination, Row, Select } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import BoxDocument from "~/components/boxDocument";
import { useGlobalDataContext } from "~/hooks/globalData";
import DocumentAPI, { DocumentParams } from "~/services/actions/document";
import StoreAPI from "~/services/actions/store";
import { BoxTitle } from "~/services/constants/styled";
import { DocumentInfo } from "~/services/types/document";
import { StoreInfo } from "~/services/types/store";

type FieldType = {
    auth?: string;
    title?: string;
    order?: string;
};

const BoxStore = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #000;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 15px;
    gap: 20px;
`

const Search = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setIsLoading } = useGlobalDataContext();
    const searchTitle = searchParams.get('title');
    const storeId = searchParams.get('store');
    const authId = searchParams.get('auth');
    const orderText = searchParams.get('order');
    const [listDocument, setListDocument] = useState<DocumentInfo[]>([])
    const [listStores, setListStores] = useState<StoreInfo[]>([])
    const [title, setTitle] = useState('Tất cả tài liệu')
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [paginationStore, setPaginationStore] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        getAllStore(
            paginationStore.current,
            paginationStore.pageSize
        )
        if (searchTitle) {
            setTitle('Kết quả tìm kiếm')
        }
        getAllDocument({
            title: searchTitle ?? undefined,
            page: pagination.current,
            limit: pagination.pageSize,
            store: storeId ?? undefined,
            order: orderText ?? undefined,
            auth: authId ?? undefined
        })

    }, [
        searchTitle, title,
        pagination.current,
        pagination.pageSize,
        paginationStore.current,
        paginationStore.pageSize,
        storeId, authId, orderText
    ])

    const getAllStore = async (page?: number, limit?: number) => {
        document.title = title
        setIsLoading(true)
        try {
            const { status, data, message } = await StoreAPI.getAll(
                page, limit
            )
            if (status === 201) {
                setListStores(data.stores)
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const getAllDocument = async (params: DocumentParams) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await DocumentAPI.getAll(params)
            if (status === 201) {
                setListDocument(data.documents)
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

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        let path = location.pathname + '?'
        if (values.title) path += `&title=${values.title}`
        if (values.auth) path += `&auth=${values.auth}`
        if (values.order) path += `&order=${values.order}`
        navigate(path)
    }

    const handlePageChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const handlePageChangeStore = (newPagination: any) => {
        setPaginationStore(newPagination);
    };

    const handleChangeStore = (id: string) => {
        let path = location.pathname
        if (path.includes('?')) {
            path += `&store=${id}`
        } else {
            path += `?store=${id}`
        }
        navigate(path)
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
                        <Input placeholder='Tên tài liệu...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="auth"
                        style={{
                            marginBottom: 0,
                            width: '50%',
                        }}
                    >
                        <Input placeholder='Tên tác giả...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="order"
                        style={{ marginBottom: 0, width: '30%' }}
                    >
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Sắp xếp theo điểm"
                            options={[
                                {
                                    value: 'desc',
                                    label: "Sắp xếp giảm"
                                },
                                {
                                    value: 'asc',
                                    label: "Sắp xếp tăng"
                                }
                            ]}
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        <SearchOutlined />
                    </Button>
                </Flex>
            </Form>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    {
                        listStores?.map((store) => (
                            <BoxStore
                                key={store.store_Id}
                                onClick={() => handleChangeStore(store.store_Id as string)}
                            >
                                {store.store_title} <span>{store.documents.length}</span>
                            </BoxStore>
                        ))
                    }
                    <Flex
                        align='center'
                        justify='center'
                        style={{ paddingTop: '10px' }}
                    >
                        <Pagination
                            total={paginationStore.total}
                            pageSize={paginationStore.pageSize}
                            current={paginationStore.current}
                            onChange={handlePageChangeStore}
                        />
                    </Flex>
                </Col>
                <Col span={18}>
                    <Row gutter={[16, 16]}>
                        {
                            listDocument?.map((doc) => (
                                <Col span={8} key={doc.document_Id}>
                                    <BoxDocument data={doc} />
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
                </Col>
            </Row>
        </>
    )
}

export default Search