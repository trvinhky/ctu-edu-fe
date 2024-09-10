import { Flex } from "antd"
import { Outlet } from "react-router-dom"
import Footer from "~/layouts/Footer"
import Header from "~/layouts/Header"

const DefaultTemplate = () => {
    return (
        <>
            <Header />
            <Flex
                align="center"
                justify="center"
                style={{ padding: '30px 0' }}
            >
                <main className="container">
                    <Outlet />
                </main>
            </Flex>
            <Footer />
        </>
    )
}

export default DefaultTemplate