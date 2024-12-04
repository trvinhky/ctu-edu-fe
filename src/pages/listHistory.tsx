import { Table, TableProps } from "antd";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGlobalDataContext } from "~/hooks/globalData";
import HistoryAPI, { HistoryParams } from "~/services/actions/history";
import { convertDate, formatCurrency } from "~/services/constants";
import { BoxTitle } from "~/services/constants/styled"
import { accountInfoSelector } from "~/services/reducers/selectors";

interface DataType {
    key: string;
    score: number;
    money: number;
    createAt: string;
}

const ListHistory = () => {
    const title = 'Lịch sử nạp'
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const { setIsLoading } = useGlobalDataContext();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const info = useSelector(accountInfoSelector)

    useEffect(() => {
        document.title = title
        getAllHistory({
            account: info?.account_Id,
            page: pagination.current,
            limit: pagination.pageSize
        })
    }, [pagination.current, pagination.pageSize, info])

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
                            score: history.recharge.recharge_score
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
            title: 'Số điểm',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Số tiền',
            dataIndex: 'money',
            key: 'money',
            render: (text) => <span>{`- ${formatCurrency(text)}`}</span>,
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
        <section>
            <BoxTitle>
                {title}
            </BoxTitle>
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

export default ListHistory