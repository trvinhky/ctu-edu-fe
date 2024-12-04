import { DollarOutlined, ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, InputNumber, Modal, Table, TableProps } from "antd";
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import RechargeAPI from "~/services/actions/recharge";
import { formatCurrency } from "~/services/constants";
import { Title } from "~/services/constants/styled"
import { Recharge } from "~/services/types/recharge";
import ButtonDelete from "~/services/utils/buttonDelete";
import ButtonEdit from "~/services/utils/buttonEdit";

interface DataType {
    key: string;
    score: number;
    money: number;
}

type FieldType = {
    recharge_money?: number
    recharge_score?: number
};

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const ManagerPoint = () => {
    const title = 'Danh sách gói nạp'
    const { setIsLoading } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [idRecharge, setIdRecharge] = useState<string>()
    const [form] = Form.useForm<FieldType>();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    useEffect(() => {
        document.title = title
        getAllRecharge(pagination.current, pagination.pageSize)
    }, [pagination.current, pagination.pageSize])

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Số điểm',
            dataIndex: 'score',
            key: 'score'
        },
        {
            title: 'Số tiền',
            dataIndex: 'money',
            key: 'money',
            render: (text) => <span>{formatCurrency(text)}</span>,
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
                    <div
                        onClick={() => showModal(record.key)}
                    >
                        <ButtonEdit />
                    </div>
                    <div
                        onClick={() => showPromiseConfirm(record.key)}
                    >
                        <ButtonDelete />
                    </div>
                </Flex>
            ),
        },
    ];

    const getAllRecharge = async (page?: number, limit?: number) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await RechargeAPI.getAll(page, limit)
            if (status === 201) {
                setDataTable(
                    data.recharges?.map((recharge) => {
                        const result: DataType = {
                            key: recharge.recharge_Id as string,
                            money: recharge.recharge_money,
                            score: recharge.recharge_score
                        }

                        return result
                    })
                )

                setPagination({
                    current: page ?? 1,
                    pageSize: limit ?? 6,
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

    const getOneRecharge = async (id: string) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await RechargeAPI.getOne(id)
            if (status === 201) {
                form.setFieldsValue({
                    recharge_money: data.recharge_money,
                    recharge_score: data.recharge_score
                })
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const showModal = async (id?: string) => {
        form.resetFields()
        if (id) {
            setIdRecharge(id)
            await getOneRecharge(id)
        } else {
            setIdRecharge('')
        }
        setIsModalOpen(true);
    };

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            let status: number = 200
            let message: string = ''
            const data: Recharge = {
                recharge_money: values.recharge_money as number,
                recharge_score: values.recharge_score as number,
                recharge_Id: idRecharge
            }
            if (idRecharge) {
                const res = await RechargeAPI.update(data)
                status = res.status
                message = res.message as string
            } else {
                const res = await RechargeAPI.create(data)
                status = res.status
                message = res.message as string
                form.resetFields()
            }
            if (status === 200) {
                await getAllRecharge(pagination.current)
                toast.success(message)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const confirmDelete = async (id: string) => {
        setIsLoading(true)
        try {
            const { message, status } = await RechargeAPI.delete(id)
            if (status === 200) {
                await getAllRecharge(1)
                toast.success(message)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const showPromiseConfirm = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa gói nạp này?',
            icon: <ExclamationCircleFilled />,
            cancelText: 'Hủy',
            async onOk() {
                await confirmDelete(id)
            },
            onCancel() { },
        });
    };

    return (
        <>
            <Title>{title}</Title>
            <Flex
                justify="flex-end"
                style={{
                    paddingBottom: '20px'
                }}
            >
                <Button
                    type="primary"
                    style={{
                        backgroundColor: '#27ae60'
                    }}
                    onClick={() => showModal()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Table
                columns={columns}
                dataSource={dataTable}
                rowKey="key"
                pagination={pagination}
                onChange={handleTableChange}
            />
            <Form
                layout="vertical"
                name="recharge"
                form={form}
                onFinish={onFinish}
            >
                <Modal
                    title={`${idRecharge ? 'Cập nhật' : 'Thêm'} gói nạp`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <React.Fragment key="action">
                            {
                                idRecharge ?
                                    <WrapperBtn onClick={handleOk}>
                                        <ButtonEdit text="Cập nhật" htmlType="submit" form="recharge" />
                                    </WrapperBtn>
                                    :
                                    <Button type="primary" onClick={handleOk} htmlType="submit" form="recharge">
                                        Thêm
                                    </Button>
                            }
                        </React.Fragment>
                    ]}
                >
                    <Form.Item<FieldType>
                        name="recharge_money"
                        label="Số tiền"
                        required
                    >
                        <InputNumber min={0} addonAfter="VNĐ" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="recharge_score"
                        label="Số điểm"
                        required
                    >
                        <InputNumber min={0} addonAfter={<DollarOutlined />} />
                    </Form.Item>
                </Modal>
            </Form>
        </>
    )
}

export default ManagerPoint