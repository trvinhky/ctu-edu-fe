import { Button, Flex, Input, Modal, Table } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Title } from '~/services/constants/styled';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalDataContext } from '~/hooks/globalData';
import SubjectAPI from '~/services/actions/subject';
import ButtonEdit from '~/services/utils/buttonEdit';

interface DataType {
    name: string;
    posts: number;
    courses: number;
    id: string;
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

const ManagerSubject = () => {
    const title = 'Danh sách môn học'
    const [open, setOpen] = useState(false);
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [idSubject, setIdSubject] = useState<string>()
    const [nameSubject, setNameSubject] = useState<string>()
    const [dataTable, setDataTable] = useState<DataType[]>([])

    useEffect(() => {
        document.title = title
        getAllSubject()
    }, [])

    const getAllSubject = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll(page, limit)
            if (status === 201 && !Array.isArray(data)) {
                setDataTable(
                    data.subjects.map((subject) => {
                        const result: DataType = {
                            name: subject.subject_name,
                            id: subject.subject_Id as string,
                            courses: subject.courses.length,
                            posts: subject.posts.length,
                            key: subject.subject_Id as string
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

    const getOneSubject = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await SubjectAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setNameSubject(data.subject_name)
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

    const createNewSubject = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await SubjectAPI.create({
                subject_name: nameSubject as string
            })
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                setNameSubject('')
                await getAllSubject()
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

    const editSubject = async () => {
        setIsLoading(true)
        try {
            const { status, message } = await SubjectAPI.update({
                subject_name: nameSubject as string,
                subject_Id: idSubject as string
            })
            if (status === 200) {
                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 3,
                });
                await getAllSubject()
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
            title: 'Tên môn học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tổng khóa học',
            dataIndex: 'courses',
            key: 'courses',
        },
        {
            title: 'Tổng bài viết',
            dataIndex: 'posts',
            key: 'posts',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    style={{ backgroundColor: '#f1c40f' }}
                    onClick={() => handleShow(record.id)}
                >
                    <EditOutlined />
                </Button>
            ),
        },
    ];

    const handleShow = async (id?: string) => {
        if (id) {
            setIdSubject(id)
            await getOneSubject(id)
        } else {
            setIdSubject('')
        }
        setOpen(true);
    }

    const handleSubmit = async () => {
        if (nameSubject) {
            if (idSubject) {
                await editSubject()
            } else {
                await createNewSubject()
            }
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <section>
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
            <Table columns={columns} dataSource={dataTable} />
            <Modal
                title={`${idSubject ? 'Cập nhật' : 'Thêm'} môn học mới`}
                open={open}
                onCancel={handleCancel}
                onOk={handleSubmit}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <React.Fragment key="action">
                        {
                            idSubject ?
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
                <Label htmlFor="name">
                    Tên môn học:
                </Label>
                <Input
                    placeholder="Tên môn học"
                    id='name'
                    value={nameSubject}
                    onChange={(e) => setNameSubject(e.target.value)}
                />
            </Modal>
        </section>
    )
}

export default ManagerSubject