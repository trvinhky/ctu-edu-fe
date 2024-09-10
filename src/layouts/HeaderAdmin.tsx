import Logo from "~/components/logo"
import { Flex } from "antd"
import styled from "styled-components"

const Header = styled.div`
    padding: 8px 0;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
`

const HeaderAdmin = () => {
    return (
        <Header>
            <Flex align="center" justify="flex-end">
                <Logo />
            </Flex>
        </Header>
    )
}

export default HeaderAdmin