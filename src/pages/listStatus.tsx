import { Table, TableProps } from "antd"
import { useEffect, useState } from "react"
import { useGlobalDataContext } from "~/hooks/globalData";
import StatusAPI from "~/services/actions/status";
import { Title } from "~/services/constants/styled"

interface DataType {
    key: number;
    name: string;
    total: number;
    id: string;
}

const ListStatus = () => {
    const title = 'Danh sách trạng thái'
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const { setIsLoading, messageApi } = useGlobalDataContext();

    useEffect(() => {
        document.title = title
        getAllStatus()
    }, [])

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            render: (text) => <span className='list-account__stt'>{text}</span>
        },
        {
            title: 'Tên trạng thái',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng bài đăng',
            dataIndex: 'total',
            key: 'total',
        }
    ];

    const getAllStatus = async () => {
        setIsLoading(true)
        try {
            const { data, status, message } = await StatusAPI.getAll(1)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.status.map((item, i) => {
                        const total = item.posts.length ?? 0
                        const result: DataType = {
                            total,
                            name: item.status_name,
                            id: item.status_Id as string,
                            key: (i + 1)
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

    return (
        <>
            <Title>{title}</Title>
            <Table columns={columns} dataSource={dataTable} pagination={false} />
        </>
    )
}

export default ListStatus