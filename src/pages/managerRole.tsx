import { PlusOutlined } from "@ant-design/icons";
import { Flex, Table, TableProps, Button, Modal, Input } from "antd"
import React, { useEffect, useState } from "react"
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import RoleAPI from "~/services/actions/role";
import { Title } from "~/services/constants/styled"
import ButtonEdit from "~/services/utils/buttonEdit";

interface DataType {
    key: number;
    name: string;
    total: number;
    id: string;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const ManagerRole = () => {
    const title = 'Danh sách quyền'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [roleName, setRoleName] = useState('');
    const [idRole, setIdRole] = useState<string>()

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
                            name: role.role_name,
                            id: role.role_Id as string
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

    const editRole = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await RoleAPI.update({
                role_name: roleName,
                role_Id: idRole
            })
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                await getAllRole()
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
            title: 'Số lượng tài khoản',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <div onClick={() => showModal(record.id)}>
                    <ButtonEdit />
                </div>
            )
        }
    ];

    const getOneRole = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await RoleAPI.getOneById(id)
            if (status === 201 && !Array.isArray(data)) {
                setRoleName(data.role_name)
                setIdRole(data.role_Id)
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

    const showModal = async (id?: string) => {
        if (id) {
            setIdRole(id)
            await getOneRole(id)
        } else {
            setIdRole('')
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        if (roleName) {
            if (idRole) {
                await editRole()
            } else {
                await createNewRole()
            }
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const createNewRole = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await RoleAPI.create({
                role_name: roleName
            })
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                setRoleName('')
                await getAllRole()
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
                    onClick={() => showModal()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Table columns={columns} dataSource={dataTable} pagination={false} />
            <Modal
                title={`${idRole ? 'Cập nhật' : 'Thêm'} quyền mới`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <React.Fragment key="action">
                        {
                            idRole ?
                                <WrapperBtn onClick={handleOk}>
                                    <ButtonEdit text="Cập nhật" />
                                </WrapperBtn>
                                :
                                <Button type="primary" onClick={handleOk}>
                                    Thêm
                                </Button>
                        }
                    </React.Fragment>
                ]}
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