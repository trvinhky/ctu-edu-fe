import { DollarOutlined, EyeOutlined, FilterOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import { Button, Flex, Form, FormProps, Input, InputNumber, Modal, Table, TableProps, Typography } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import ViewIcon from "~/components/viewIcon"
import { useGlobalDataContext } from "~/hooks/globalData"
import BuyAPI, { BuyProps } from "~/services/actions/buy"
import { convertDate, ENV } from "~/services/constants"
import { BoxTitle } from "~/services/constants/styled"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"
import { Buy, BuyInfo } from "~/services/types/buy"

interface DataType {
    key: string;
    title: string;
    format: string;
    score: number;
    document: string;
    account: string;
    url: string;
}

type FieldType = {
    score?: number;
    title?: string;
};

const WrapperIcon = styled.div`
    font-size: 60px;
`

const BoxText = styled.div`
    &>span:first-child {
        font-weight: 600;
    }
`

const ListBuy = () => {
    const title = 'Bài học đã mua'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const account = useSelector(accountInfoSelector)
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [open, setOpen] = useState(false);
    const [buyDetail, setBuyDetail] = useState<BuyInfo>()
    const token = useSelector(accountTokenSelector)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        if (account) {
            getAllDocumentBuy({
                account: account.account_Id,
                page: pagination.current,
                limit: pagination.pageSize
            })
        }
    }, [account, pagination.current, pagination.pageSize])

    const getAllDocumentBuy = async (params: BuyProps) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await BuyAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.buy.map((item) => {
                        const document = item.document
                        const result: DataType = {
                            key: item.buy_date?.toString() as string,
                            format: document.format.format_description,
                            title: document.document_title,
                            score: document.document_score,
                            document: document.document_Id as string,
                            account: item.account_Id,
                            url: document.document_url as string
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

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tên tài liệu',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Định dạng file',
            dataIndex: 'format',
            key: 'format',
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
            key: 'score',
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
                    <Button
                        type="primary"
                        onClick={() => handleShowDetail({
                            document_Id: record.document,
                            account_Id: record.account
                        })}
                    >
                        <EyeOutlined />
                    </Button>
                    <Button
                        type='primary'
                        style={{ backgroundColor: '#27ae60' }}
                        onClick={() => downloadFile(record.url)}
                    >
                        <VerticalAlignBottomOutlined />
                    </Button>
                </Flex>
            ),
        },
    ];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (account) {
            await getAllDocumentBuy({
                page: pagination.pageSize,
                account: account.account_Id,
                score: values.score ? +values.score : undefined,
                title: values.title,
                limit: pagination.pageSize
            })
        }
    }

    const getDetailDocumentBuy = async (params: Buy) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await BuyAPI.getOne(params)
            if (status === 201 && !Array.isArray(data)) {
                setBuyDetail(data)
            } else {
                messageApi.open({
                    type: 'error',
                    content: message,
                    duration: 3,
                });
            }
        } catch (e) {
            console.log(e)
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    const downloadFile = async (fileName: string) => {
        try {
            const response = await fetch(`${ENV.BE_HOST}/file/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fileName: fileName })
            })

            if (!response.ok) {
                messageApi.open({
                    type: 'error',
                    content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                    duration: 3,
                });
                return
            }

            const parts = fileName.split('\\');

            const blob = await response.blob(); // Chuyển dữ liệu thành blob (Binary Large Object)
            const url = window.URL.createObjectURL(blob); // Tạo URL từ blob
            const link = document.createElement('a'); // Tạo thẻ <a> tạm để tải file
            link.href = url;
            link.download = parts[parts.length - 1]; // Tên file tải về
            document.body.appendChild(link);
            link.click(); // Tự động click vào thẻ <a> để tải file
            link.remove(); // Xóa thẻ sau khi tải xong
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const handleShowDetail = async (data: Buy) => {
        await getDetailDocumentBuy(data)
        setOpen(true)
    }

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <section>
            <BoxTitle>{title}</BoxTitle>
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
                        <Input placeholder='Tên bài học...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="score"
                        style={{ marginBottom: 0, width: '30%' }}
                    >
                        <InputNumber
                            min={0}
                            addonAfter={<DollarOutlined />}
                            style={{ width: '100%' }}
                            placeholder="Số điểm"
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
                title="Thông tin bài học"
                open={open}
                onCancel={() => setOpen(false)}
                footer={
                    <Button type="primary" onClick={() => setOpen(false)}>
                        OK
                    </Button>
                }
            >
                {
                    buyDetail &&
                    <Flex
                        gap={10}
                    >
                        <WrapperIcon>
                            <ViewIcon
                                url={buyDetail.document.document_url}
                                format={buyDetail.document.format.format_name}
                            />
                        </WrapperIcon>
                        <div>
                            <Typography.Title
                                level={4}
                                style={{ textAlign: 'center', marginBottom: '10px' }}
                            >
                                {buyDetail.document.document_title}
                            </Typography.Title>
                            <BoxText>
                                <span>Số điểm: </span> {buyDetail.document.document_score} <DollarOutlined />
                            </BoxText>
                            <BoxText>
                                <span>Ngày mua: </span> {buyDetail.buy_date && convertDate(buyDetail.buy_date.toString())}
                            </BoxText>
                            <BoxText>
                                <span>Nội dung: </span>
                                <Typography.Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}>
                                    {buyDetail.document.document_content}
                                </Typography.Paragraph>
                            </BoxText>
                        </div>
                    </Flex>
                }
            </Modal>
        </section>
    )
}

export default ListBuy