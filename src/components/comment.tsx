import { EyeOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Flex, Input, Modal, Typography } from "antd"
import { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"

const Wrapper = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 15px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
`

const Name = styled.h4`
    font-weight: 600;
    font-size: 18px;
    text-align: left;
    padding-bottom: 6px;
`

const LinkCourse = styled(Link)`
    display: block;
    text-align: right;
    display: -webkit-box;
    line-height: 1;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 40%;
`

const Action = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
`

const Time = styled.span`
    display: block;
    font-style: italic;
    color: #2980b9;
    font-weight: 500;
`

const WrapperBtn = styled.span`
    display: inline-block;
    width: fit-content;
`

const Comment = (
    {
        isAvatar,
        isAction
    }
        : {
            isAvatar?: boolean,
            isAction?: boolean
        }
) => {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    const showModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const handleOkEdit = () => {
        setIsModalOpenEdit(false);
    };

    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
    };

    return (
        <Wrapper>
            {isAvatar && <Avatar size={64} icon={<UserOutlined />} />}
            <div style={{ flex: 1 }}>
                <Name>Jack</Name>
                <Time>07:00:00 12/09/2024</Time>
                <Typography.Paragraph
                    ellipsis={{ rows: 4, expandable: false }}
                    style={{ paddingTop: '6px' }}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium veniam tenetur et iure? Earum magnam quam sit optio deserunt quae? Magnam, nobis quam eius dolorum dicta molestias id voluptatibus quaerat.
                </Typography.Paragraph>
                {
                    isAction ?
                        <LinkCourse to='/'>
                            #Lập trình Web Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste consequuntur non necessitatibus molestias possimus, magnam nemo enim modi repudiandae, iure odit dolorum eum molestiae saepe, debitis ab voluptatem nostrum ipsum.
                        </LinkCourse> :
                        <Flex justify="flex-end">
                            <Button
                                style={{ paddingInline: '20px' }}
                            >
                                <MessageOutlined />
                            </Button>
                        </Flex>
                }
            </div>

            <Action>
                {
                    isAction &&
                    <>
                        <Button
                            type="primary"
                            shape="circle"
                        >
                            <EyeOutlined />
                        </Button>
                        <ButtonDelete shape="circle" />
                    </>

                }
                <WrapperBtn
                    onClick={showModalEdit}
                >
                    <ButtonEdit shape="circle" />
                </WrapperBtn>
            </Action>
            <Modal title="Chỉnh sửa"
                open={isModalOpenEdit}
                onOk={handleOkEdit}
                onCancel={handleCancelEdit}
                footer={[
                    <Button key="back" onClick={handleCancelEdit}>
                        Thoát
                    </Button>,
                    <WrapperBtn
                        style={{ paddingLeft: '10px' }}
                    >
                        <ButtonEdit text="Cập nhật" />
                    </WrapperBtn>
                ]}
            >
                <Input.TextArea rows={4} />
            </Modal>
        </Wrapper>
    )
}

export default Comment