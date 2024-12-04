import { DollarOutlined, EyeOutlined, FilterOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import { Button, Flex, Form, FormProps, Input, InputNumber, Table, TableProps } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useGlobalDataContext } from "~/hooks/globalData"
import BuyAPI, { BuyProps } from "~/services/actions/buy"
import { ENV } from "~/services/constants"
import { PATH } from "~/services/constants/navbarList"
import { BoxTitle } from "~/services/constants/styled"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom"

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

const ListBuy = () => {
    const title = 'Tài liệu đã mua'
    const { setIsLoading } = useGlobalDataContext();
    const account = useSelector(accountInfoSelector)
    const [dataTable, setDataTable] = useState<DataType[]>([])
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
            if (status === 201) {
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
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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
                    <ButtonLinkCustom
                        shape="default"
                        href={PATH.DETAIL_DOCUMENT.replace(':id', record.document)}
                    >
                        <EyeOutlined />
                    </ButtonLinkCustom>
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
                toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
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
        </section>
    )
}

export default ListBuy