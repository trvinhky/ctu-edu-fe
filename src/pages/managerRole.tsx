import { PlusOutlined } from "@ant-design/icons";
import { Flex, Table, TableProps, Button, Modal, Input } from "antd"
import { useEffect, useState } from "react"
import { useGlobalDataContext } from "~/hooks/globalData";
import RoleAPI from "~/services/actions/role";
import { Title } from "~/services/constants/styled"

interface DataType {
    key: number;
    name: string;
    total: number;
}

const ManagerRole = () => {
    const title = 'Danh sách quyền'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [roleName, setRoleName] = useState('');

    useEffect(() => {
        document.title = title
        getAllRole()
    }, [])

    const getAllRole = async () => {
        setIsLoading(true)
        try {
            const { data, status, message } = await RoleAPI.getAllByAccount(1)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.roles.map((role, i) => {
                        const total = role.accounts?.length ?? 0
                        const result: DataType = {
                            total,
                            key: (i + 1),
                            name: role.role_name
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

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            render: (text) => <span className='list-account__stt'>{text}</span>
        },
        {
            title: 'Tên quyền',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'total',
            key: 'total',
        }
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        if (roleName) await createNewRole(roleName)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const createNewRole = async (value: string) => {
        setIsLoading(true)
        try {
            const { status, message } = await RoleAPI.create({
                role_name: value
            })
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
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
                    onClick={showModal}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Table columns={columns} dataSource={dataTable} pagination={false} />
            <Modal
                title="Thêm quyền mới"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    placeholder="Tên quyền"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
            </Modal>
        </>
    )
}

export default ManagerRole