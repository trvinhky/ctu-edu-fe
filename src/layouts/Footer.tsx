import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons"
import { Flex } from "antd"
import styled from "styled-components"
import Logo from "~/components/logo"

const FooterContent = styled.footer`
    padding-top: 10px;
    border-top: 1px solid rgba(5, 5, 5, 0.1);
`

const List = styled.ul`
    h3 {
        font-weight: 600;
        margin-bottom: 6px;
        font-size: 16px;
    }
`

const Item = styled.li`
    font-size: 14px;
    padding-bottom: 4px;
    font-weight: 500;
`

const EndTag = styled.p`
    padding: 10px 0;
    text-align: center;
    background-color: rgba(5, 5, 5, 0.05);
    margin-top: 10px;
`

const Footer = () => {
    return (
        <Flex align="center" justify="center">
            <FooterContent className="container">
                <Flex justify="space-between" gap='10px'>
                    <Logo size={20} />
                    <List>
                        <h3>Liên hệ</h3>
                        <Item>
                            <EnvironmentOutlined /> 227 Nguyễn Văn Cừ, Phường 4, Quận 5, Tp HCM
                        </Item>
                        <Item>
                            <MailOutlined /> kyb2005802@student.ctu.edu.vn
                        </Item>
                        <Item>
                            <PhoneOutlined /> 0947468740
                        </Item>
                    </List>
                </Flex>
                <EndTag>Copyright © Trương Vĩnh Ký - B2005802</EndTag>
            </FooterContent>
        </Flex>
    )
}

export default Footer