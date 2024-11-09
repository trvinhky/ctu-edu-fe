import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, FormProps, Input, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import BoxStore from "~/components/boxStore";
import { useGlobalDataContext } from "~/hooks/globalData";
import StoreAPI from "~/services/actions/store";
import { BoxTitle } from "~/services/constants/styled";
import { StoreInfo } from "~/services/types/store";

type FieldType = {
    title?: string;
};

const ListStore = () => {
    const title = 'Tất cả kho tài liệu'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listStore, setListStore] = useState<StoreInfo[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllStore(
            pagination.current,
            pagination.pageSize
        )
    }, [pagination.current, pagination.pageSize])

    const getAllStore = async (page?: number, limit: number = 6, title?: string) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await StoreAPI.getAll(page, limit, title)
            if (status === 201 && !Array.isArray(data)) {
                setListStore(data.stores)
                setPagination({
                    current: page ?? 1,
                    pageSize: limit,
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

    const handlePageChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        await getAllStore(
            pagination.current,
            pagination.pageSize,
            values.title
        )
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
                        <Input placeholder='Tên kho...' />
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
                    listStore?.map((store) => (
                        <Col span={6} key={store.store_Id}>
                            <BoxStore data={store} />
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

export default ListStore