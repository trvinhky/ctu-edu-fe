import { Flex } from "antd"
import Logo from "~/components/logo"

const HeaderShort = () => {
    return (
        <header style={{ padding: '10px 0' }}>
            <Flex align="center" justify="center">
                <div className="container">
                    <Logo />
                </div>
            </Flex>
        </header>
    )
}

export default HeaderShort