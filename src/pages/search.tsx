import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, FormProps, Input, Pagination, Row, Select } from "antd"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import BoxDocument from "~/components/boxDocument";
import { useGlobalDataContext } from "~/hooks/globalData";
import DocumentAPI, { DocumentParams } from "~/services/actions/document";
import FormatAPI from "~/services/actions/format";
import { BoxTitle } from "~/services/constants/styled";
import { Option } from "~/services/types/dataType";
import { DocumentInfo } from "~/services/types/document";

type FieldType = {
    format?: string;
    title?: string;
};

const Search = () => {
    const [searchParams] = useSearchParams();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const searchTitle = searchParams.get('title');
    const [listDocument, setListDocument] = useState<DocumentInfo[]>([])
    const [formatOptions, setFormatOptions] = useState<Option[]>([])
    const [title, setTitle] = useState('Tất cả tài liệu')
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    useEffect(() => {
        getAllFormat()
        if (searchTitle) {
            setTitle('Kết quả tìm kiếm')
        }
        getAllDocument({
            title: searchTitle ?? undefined,
            page: pagination.current,
            limit: pagination.pageSize
        })

    }, [searchTitle, title, pagination.current, pagination.pageSize])

    const getAllFormat = async () => {
        document.title = title
        setIsLoading(true)
        try {
            const { status, data, message } = await FormatAPI.getAll()
            if (status === 201 && !Array.isArray(data)) {
                setFormatOptions(
                    data.formats.map((format) => {
                        const result: Option = {
                            value: format.format_Id as string,
                            label: format.format_description
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

    const getAllDocument = async (params: DocumentParams) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await DocumentAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setListDocument(data.documents)
                setPagination({
                    current: params.page ?? 1,
                    pageSize: params.limit ?? 8,
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
        await getAllDocument({ page: 1, title: values.title, format: values.format })
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
                        <Input placeholder='Tên tài liệu...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="format"
                        style={{ marginBottom: 0, width: '40%' }}
                    >
                        <Select
                            style={{ width: "100%" }}
                            placeholder="chọn định dạng file"
                            options={formatOptions}
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
                    listDocument?.map((doc) => (
                        <Col span={6} key={doc.document_Id}>
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
        </>
    )
}

export default Search