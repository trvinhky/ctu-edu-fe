import { ExclamationCircleFilled, EyeOutlined, PlusOutlined, QuestionOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Table, TableProps } from "antd"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import ExamAPI from "~/services/actions/exam";
import { PATH } from "~/services/constants/navbarList";
import { BoxTitle } from "~/services/constants/styled"
import ButtonBack from "~/services/utils/buttonBack";
import ButtonDelete from "~/services/utils/buttonDelete";
import ButtonEdit from "~/services/utils/buttonEdit";
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom";

interface DataType {
    key: string;
    title: string;
    limit: number;
}

const ManagerExam = () => {
    const { id } = useParams();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const navigate = useNavigate()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    const title = 'Danh sách bài thi'
    useEffect(() => {
        document.title = title
        if (id) {
            getAllExams(pagination.current, pagination.pageSize, id)
        } else navigate(-1)
    }, [id, pagination.current, pagination.pageSize])

    const getAllExams = async (page?: number, limit: number = 6, course?: string) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await ExamAPI.getAll(page, course, limit)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.exams?.map((exam) => {
                        const result: DataType = {
                            key: exam.exam_Id as string,
                            title: exam.exam_title,
                            limit: exam.exam_limit
                        }

                        return result
                    })
                )
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

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: "40%"
        },
        {
            title: 'Thời gian',
            dataIndex: 'limit',
            key: 'limit',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Flex gap={10}>
                    <ButtonLinkCustom href={PATH.DETAIL_EXAM.replace(':id', record.key)} shape="default">
                        <EyeOutlined />
                    </ButtonLinkCustom>
                    <Link to={PATH.UPDATE_EXAM.replace(':id', record.key)}>
                        <ButtonEdit />
                    </Link>
                    <Button type="primary" style={{ background: '#16a085' }}>
                        <Link to={PATH.QUESTION_EXAM.replace(':id', record.key)}>
                            <QuestionOutlined />
                        </Link>
                    </Button>
                    <div onClick={() => showPromiseConfirm(record.key)}>
                        <ButtonDelete />
                    </div>
                </Flex>
            )
        }
    ]

    const confirmDelete = async (idFind: string) => {
        setIsLoading(true)
        try {
            const { message, status } = await ExamAPI.delete(idFind)
            if (status === 200) await getAllExams(pagination.current, pagination.pageSize, id)
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

    const showPromiseConfirm = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa bài thi này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(id)
            },
            onCancel() { },
        });
    };

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex
                justify="space-between"
                gap={10}
                style={{
                    paddingBottom: 10
                }}
            >
                <ButtonBack />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                >
                    <Link to={`${PATH.CREATE_EXAM.replace(':id', id as string)}`}>
                        <PlusOutlined />
                    </Link>
                </Button>
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

export default ManagerExam