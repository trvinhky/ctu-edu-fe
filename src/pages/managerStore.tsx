import { Button, Flex, Form, Input, Modal, Table } from 'antd';
import type { TableProps } from 'antd';
import { CloudUploadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Title } from '~/services/constants/styled';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalDataContext } from '~/hooks/globalData';
import ButtonEdit from '~/services/utils/buttonEdit';
import StoreAPI from '~/services/actions/store';
import { convertUrl } from '~/services/constants';

interface DataType {
    name: string;
    image: string;
    documents: number;
    key: string;
}

const Label = styled.label`
    font-weight: 600;
    padding-bottom: 6px;
    display: block;
`

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
    padding-left: 10px;
`

const UploadBox = styled.label`
    border-radius: 10px;
    width: 100%;
    height: 200px;
    border: 1px dashed #000;
    font-size: 20px;
    cursor: pointer;
    display: inline-block;
    background-size: cover;
    background-position: center;
`

const ImageStore = styled.img`
    width: 50px;
    height: auto;
    object-fit: cover;
`

const Content = styled.section`
    td {
        vertical-align: middle;
    }
`

const ManagerStore = () => {
    const title = 'Danh sách kho tài liệu'
    const [open, setOpen] = useState(false);
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [storeId, setStoreId] = useState<string>()
    const [storeTitle, setStoreTitle] = useState<string>()
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        document.title = title
        getAllStore(
            pagination.current,
            pagination.pageSize
        )
    }, [pagination.current, pagination.pageSize])

    const getAllStore = async (page?: number, limit: number = 6, title?: string) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await StoreAPI.getAll(page, limit, title)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.stores.map((store) => {
                        const result: DataType = {
                            name: store.store_title as string,
                            image: convertUrl(store.store_image as string),
                            documents: store.documents.length,
                            key: store.store_Id as string
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

    const getOneStore = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await StoreAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setImageSrc(convertUrl(data?.store_image as string))
                setStoreTitle(data.store_title)
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

    const createNewStore = async (data: FormData) => {
        setIsLoading(true)
        try {
            const { status, message } = await StoreAPI.create(data)
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                await getAllStore(
                    pagination.current,
                    pagination.pageSize
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

    const editStore = async (id: string, data: FormData) => {
        setIsLoading(true)
        try {
            const { status, message } = await StoreAPI.update(id, data)
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                await getAllStore(
                    pagination.current,
                    pagination.pageSize
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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <ImageStore src={text} />,
        },
        {
            title: 'Tên kho',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Tổng tài liệu',
            dataIndex: 'documents',
            key: 'documents',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    style={{ backgroundColor: '#f1c40f' }}
                    onClick={() => handleShow(record.key)}
                >
                    <EditOutlined />
                </Button>
            ),
        },
    ];

    const resetForm = () => {
        setImageSrc(undefined)
        setStoreTitle(undefined)
    }

    const handleShow = async (id?: string) => {
        resetForm()
        if (id) {
            setStoreId(id)
            await getOneStore(id)
        } else {
            setStoreId('')
        }
        setOpen(true);
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append('store_title', storeTitle as string)
        if (selectedFile) {
            formData.append('file', selectedFile)
        }
        if (storeId) {
            await editStore(storeId, formData)
        } else {
            await createNewStore(formData)
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleTableChange = (newPagination: any) => {
        setPagination(newPagination);
    };

    return (
        <Content>
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
                    onClick={() => handleShow()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <Table
                columns={columns}
                dataSource={dataTable}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
            />
            <Modal
                title={`${storeId ? 'Cập nhật' : 'Thêm'} môn kho tài liệu`}
                open={open}
                onCancel={handleCancel}
                onOk={handleSubmit}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <React.Fragment key="action">
                        {
                            storeId ?
                                <WrapperBtn onClick={handleSubmit}>
                                    <ButtonEdit text="Cập nhật" />
                                </WrapperBtn>
                                :
                                <Button type="primary" onClick={handleSubmit}>
                                    Thêm
                                </Button>
                        }
                    </React.Fragment>
                ]}
            >
                <UploadBox
                    htmlFor="image"
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                    }}
                >
                    <Form.Item
                        style={{ display: 'none' }}
                    >
                        <Input
                            type="file"
                            hidden
                            id="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </Form.Item>
                    {
                        (imageSrc?.includes('undefined') || !imageSrc) &&
                        <Flex
                            align="center"
                            justify="center"
                            style={{
                                flexDirection: 'column',
                                height: '100%'
                            }}
                        >
                            <CloudUploadOutlined />
                            <span>Chọn ảnh</span>
                        </Flex>
                    }
                </UploadBox>
                <Label htmlFor="name" style={{ paddingTop: 10 }}>
                    Tên kho:
                </Label>
                <Input
                    placeholder="Tên kho"
                    id='name'
                    value={storeTitle}
                    onChange={(e) => setStoreTitle(e.target.value)}
                />
            </Modal>
        </Content>
    )
}

export default ManagerStore