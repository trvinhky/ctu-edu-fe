import { DollarOutlined } from "@ant-design/icons";
import { Flex, Table, TableProps, Tag } from "antd";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { useGlobalDataContext } from "~/hooks/globalData";
import HistoryAPI, { HistoryParams } from "~/services/actions/history";
import { convertDate, formatCurrency } from "~/services/constants";
import { Title } from "~/services/constants/styled"

interface DataType {
    key: string;
    score: number;
    money: number;
    name: string;
    createAt: string;
}

const Revenue = () => {
    const title = 'Doanh thu'
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const { setIsLoading } = useGlobalDataContext();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [total, setTotal] = useState<number>(0)

    useEffect(() => {
        document.title = title
        getAllHistory({
            page: pagination.current,
            limit: pagination.pageSize
        })
        getTotal()
    }, [pagination.current, pagination.pageSize])

    const getAllHistory = async (params: HistoryParams) => {
        setIsLoading(true)
        try {
            const { data, status, message } = await HistoryAPI.getAll(params)
            if (status === 201) {
                setDataTable(
                    data.histories.map((history) => {
                        const result: DataType = {
                            key: history.history_Id as string,
                            createAt: convertDate((history.history_createdAt as Date).toString()),
                            money: history.recharge.recharge_money,
                            score: history.recharge.recharge_score,
                            name: history.account.account_name
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

    const getTotal = async () => {
        setIsLoading(true)
        try {
            const { data, status, message } = await HistoryAPI.getTotal()
            if (status === 201) {
                setTotal(data)
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
            title: 'Số điểm',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Số tiền',
            dataIndex: 'money',
            key: 'money',
            render: (text) => <span>{`+ ${formatCurrency(text)}`}</span>,
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngày nạp',
            dataIndex: 'createAt',
            key: 'createAt',
        },
    ];

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <>
            <Title>
                {title}
            </Title>
            <Flex
                justify="flex-end"
                style={{
                    padding: '4px 0 10px'
                }}
            >
                <Tag icon={<DollarOutlined />} color="success">
                    {formatCurrency(total)}
                </Tag>
            </Flex>
            <Table
                columns={columns}
                dataSource={dataTable}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="key"
            />
        </>
    )
}

export default Revenue