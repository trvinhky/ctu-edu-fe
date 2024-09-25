import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Modal, Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalDataContext } from "~/hooks/globalData";
import CategoryAPI from "~/services/actions/category";
import { Title } from "~/services/constants/styled";
import ButtonEdit from "~/services/utils/buttonEdit";

interface DataType {
    key: number;
    name: string;
    resources: number;
    questions: number;
    id: string;
}

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const ManagerCategory = () => {
    const title = 'Danh sách loại file'
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [CategoryName, setCategoryName] = useState('');
    const [idCategory, setIdCategory] = useState<string>()

    useEffect(() => {
        document.title = title
        getAllCategory()
    }, [])

    const getAllCategory = async () => {
        setIsLoading(true)
        try {
            const { data, status, message } = await CategoryAPI.getAll(1)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.categories.map((category, i) => {
                        const result: DataType = {
                            key: (i + 1),
                            id: category.category_Id,
                            name: category.category_name,
                            questions: category.questions.length ?? 0,
                            resources: category.resources.length ?? 0
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

    const editCategory = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await CategoryAPI.update({
                category_Id: idCategory as string,
                category_name: CategoryName

            })
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                await getAllCategory()
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
            title: 'Tên loại file',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng câu hỏi',
            dataIndex: 'questions',
            key: 'questions',
        },
        {
            title: 'Số lượng bài học',
            dataIndex: 'resources',
            key: 'resources',
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

    const getOneCategory = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await CategoryAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setCategoryName(data.category_name)
                setIdCategory(data.category_Id)
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
            setIdCategory(id)
            await getOneCategory(id)
        } else {
            setIdCategory('')
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = async () => {
        if (CategoryName) {
            if (idCategory) {
                await editCategory()
            } else {
                await createNewCategory()
            }
        }
        setIsModalOpen(false);
    };

    const createNewCategory = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await CategoryAPI.create({
                category_Id: idCategory as string,
                category_name: CategoryName
            })
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                setCategoryName('')
                await getAllCategory()
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
                title={`${idCategory ? 'Cập nhật' : 'Thêm'} loại file`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <React.Fragment key="action">
                        {
                            idCategory ?
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
                    placeholder="Tên loại file"
                    value={CategoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
            </Modal>
        </>
    )
}

export default ManagerCategory