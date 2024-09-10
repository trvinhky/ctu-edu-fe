import { EyeOutlined, FilterOutlined, FolderOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { Button, Flex, Input, Select, Typography, Modal, Pagination, Form } from "antd"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import styled from "styled-components";
import Question from "~/components/question";
import { BoxTitle } from "~/services/constants/styled"
import { Option } from "~/services/types/dataType";
import ButtonDelete from "~/services/utils/buttonDelete";
import ButtonEdit from "~/services/utils/buttonEdit";

const Box = styled.div`
    display: flex;
    gap: 10px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 15px;

    &>div {
        flex: 1;
    }
`

const Icon = styled.span`
    font-size: 40px;
`

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
`

const Note = styled.span`
    font-style: italic;
    color: red
`

const ManagerQuestion = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titleModel, setTitleModel] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

    const title = 'Danh sách câu hỏi'
    useEffect(() => {
        document.title = title
    }, [])

    const options: Option[] = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled' },
    ]

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const showModal = (id?: string) => {
        setTitleModel(id ? 'Chỉnh sửa' : 'Thêm mới')
        setIsEdit(!!id)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChangeCategory = (value: string) => {
        console.log(`selected ${value}`);
    };

    const showModalDetail = () => {
        setIsModalDetailOpen(true);
    };

    const handleOkDetail = () => {
        setIsModalDetailOpen(false);
    };

    const handleCancelDetail = () => {
        setIsModalDetailOpen(false);
    };

    return (
        <>
            <BoxTitle>{title}</BoxTitle>
            <Flex
                align='center'
                justify='flex-end'
                gap={10}
                style={{ marginBottom: '15px' }}
            >
                <Select
                    defaultValue={options[0].value}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={options}
                />
                <Button
                    type="primary"
                >
                    <FilterOutlined />
                </Button>
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                    onClick={() => showModal()}
                >
                    <PlusOutlined />
                </Button>
            </Flex>
            <div>
                <Box>
                    <Icon>
                        <QuestionCircleOutlined />
                    </Icon>
                    <div>
                        <Typography.Paragraph
                            ellipsis={{ rows: 2, expandable: true, symbol: 'xem thêm' }}
                            style={{ marginBottom: '0' }}
                        >
                            Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team.
                        </Typography.Paragraph>
                        <Flex justify="flex-end" gap={10} style={{ paddingTop: '10px' }}>
                            <Button type="primary" onClick={showModalDetail}>
                                <EyeOutlined />
                            </Button>
                            <WrapperBtn onClick={() => showModal('hbhjbj')}>
                                <ButtonEdit />
                            </WrapperBtn>
                            <ButtonDelete />
                            <Button
                                type="primary"
                                style={{ backgroundColor: '#4834d4' }}
                            >
                                <Link to="/question-resource/jgjjhgj">
                                    <FolderOutlined />
                                </Link>
                            </Button>
                        </Flex>
                    </div>
                </Box>
                <Box>
                    <Icon>
                        <QuestionCircleOutlined />
                    </Icon>
                    <div>
                        <Typography.Paragraph
                            ellipsis={{ rows: 2, expandable: true, symbol: 'xem thêm' }}
                            style={{ marginBottom: '0' }}
                        >
                            Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team.
                        </Typography.Paragraph>
                        <Flex justify="flex-end" gap={10} style={{ paddingTop: '10px' }}>
                            <Button type="primary" onClick={showModalDetail}>
                                <EyeOutlined />
                            </Button>
                            <WrapperBtn onClick={() => showModal('hbhjbj')}>
                                <ButtonEdit />
                            </WrapperBtn>
                            <ButtonDelete />
                            <Button
                                type="primary"
                                style={{ backgroundColor: '#4834d4' }}
                            >
                                <Link to="/question-resource/jgjjhgj">
                                    <FolderOutlined />
                                </Link>
                            </Button>
                        </Flex>
                    </div>
                </Box>
                <Modal
                    title={`${titleModel} câu hỏi`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                        <WrapperBtn
                            style={{ paddingLeft: '10px' }}
                        >
                            {
                                isEdit ?
                                    <ButtonEdit text={titleModel} /> :
                                    <Button type="primary">
                                        {titleModel}
                                    </Button>
                            }
                        </WrapperBtn>
                    ]}
                >
                    <Form
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="category_Id"
                            label="Chọn loại"
                        >
                            <Select
                                defaultValue="lucy"
                                style={{ width: '100%' }}
                                onChange={handleChangeCategory}
                                id="category_Id"
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                    { value: 'lucy', label: 'Lucy' }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="question_content"
                            label="Nội dung"
                            rules={[{
                                required: true,
                                message: 'Vui lòng nhập nội dung của bạn!',
                            }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Câu trả lời"
                            style={{ marginBottom: 24 }}
                        >
                            <Form.List name="options">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Flex
                                                key={key}
                                                style={{ marginBottom: 8 }}
                                                align="center"
                                                gap={5}
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'option_content']}
                                                    rules={[{
                                                        required: true,
                                                        message: 'Vui lòng nhập nội dung câu trả lời!'
                                                    }]}
                                                    style={{ flex: 1, marginBottom: 0 }}
                                                >
                                                    <Input placeholder="Nội dung câu trả lời" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'option_is_correct']}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Input type="radio" name="correct" />
                                                </Form.Item>
                                                <div onClick={() => remove(name)}>
                                                    <ButtonDelete />
                                                </div>
                                            </Flex>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Thêm câu trả lời
                                            </Button>
                                        </Form.Item>
                                        <Note>
                                            Check đê đánh dấu câu trả lời đúng.
                                        </Note>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Chi tiết câu hỏi"
                    open={isModalDetailOpen}
                    onOk={handleOkDetail}
                    onCancel={handleCancelDetail}
                    footer={[
                        <Button type="primary">
                            Ok
                        </Button>
                    ]}
                >
                    <Question />
                </Modal>
                <Flex
                    align='center'
                    justify='center'
                    style={{ marginTop: '15px' }}
                >
                    <Pagination defaultCurrent={1} total={50} />
                </Flex>
            </div>
        </>
    )
}

export default ManagerQuestion