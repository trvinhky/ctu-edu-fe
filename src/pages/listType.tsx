import { Table, TableProps } from "antd"
import { useEffect, useState } from "react"
import { useGlobalDataContext } from "~/hooks/globalData";
import TypeAPI from "~/services/actions/type";
import { Title } from "~/services/constants/styled"

interface DataType {
    key: number;
    name: string;
    total: number;
    id: string;
}

const ListType = () => {
    const title = 'Danh sách loại câu hỏi'
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const { setIsLoading, messageApi } = useGlobalDataContext();

    useEffect(() => {
        document.title = title
        getAllType()
    }, [])

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            render: (text) => <span className='list-account__stt'>{text}</span>
        },
        {
            title: 'Tên loại câu hỏi',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng câu hỏi',
            dataIndex: 'total',
            key: 'total',
        }
    ];

    const getAllType = async () => {
        setIsLoading(true)
        try {
            const { data, status, message } = await TypeAPI.getAll(1)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.types.map((type, i) => {
                        const total = type.questions.length ?? 0
                        const result: DataType = {
                            total,
                            name: type.type_name,
                            id: type.type_Id as string,
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

export default ListType