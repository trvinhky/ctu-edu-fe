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
    category: string;
    score: number;
    lesson: string;
    student: string;
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

    useEffect(() => {
        document.title = title
        if (account) {
            getAllLessonBuy({ student: account.account_Id })
        }
    }, [account])

    const getAllLessonBuy = async (params: BuyProps) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await BuyAPI.getAll(params)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.buy.map((item) => {
                        const lesson = item.lesson
                        const result: DataType = {
                            key: item.buy_date?.toString() as string,
                            category: lesson.category.category_description,
                            title: lesson.lesson_title,
                            score: lesson.lesson_score,
                            lesson: item.lesson_Id,
                            student: item.student_Id,
                            url: lesson.lesson_url
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
            console.log(e)
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
            title: 'Tên bài học',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Loại file',
            dataIndex: 'category',
            key: 'category',
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
                            lesson_Id: record.lesson,
                            student_Id: record.student
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
            await getAllLessonBuy({
                page: 1,
                student: account.account_Id,
                score: values.score ? +values.score : undefined,
                title: values.title
            })
        }
    }

    const getDetailLessonBuy = async (params: Buy) => {
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
        await getDetailLessonBuy(data)
        setOpen(true)
    }

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
            <Table columns={columns} dataSource={dataTable} />
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
                                url={buyDetail.lesson.lesson_url}
                                category={buyDetail.lesson.category.category_name}
                            />
                        </WrapperIcon>
                        <div>
                            <Typography.Title
                                level={4}
                                style={{ textAlign: 'center', marginBottom: '10px' }}
                            >
                                {buyDetail.lesson.lesson_title}
                            </Typography.Title>
                            <BoxText>
                                <span>Số điểm: </span> {buyDetail.lesson.lesson_score} <DollarOutlined />
                            </BoxText>
                            <BoxText>
                                <span>Ngày mua: </span> {buyDetail.buy_date && convertDate(buyDetail.buy_date.toString())}
                            </BoxText>
                            <BoxText>
                                <span>Nội dung: </span>
                                <Typography.Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}>
                                    {buyDetail.lesson.lesson_content}
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