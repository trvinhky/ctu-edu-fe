import { Flex } from "antd"
import { Outlet } from "react-router-dom"
import styled from "styled-components"
import NavbarIndividual from "~/components/navbarIndividual"
import Footer from "~/layouts/Footer"
import Header from "~/layouts/Header"
import { NAVBARSTUDENT, NAVBARTEACHER } from "~/services/constants/navbarList"

const Navbar = styled.div`
    width: 25%;
`

const InfoTemplate = () => {
    const items = false ? NAVBARSTUDENT : NAVBARTEACHER

    return (
        <>
            <Header />
            <Flex
                align="center"
                justify="center"
                style={{ padding: '30px 0' }}
            >
                <main className="container">
                    <Flex>
                        <Navbar>
                            <NavbarIndividual
                                items={items}
                            />
                        </Navbar>
                        <section style={{ flex: 1, paddingLeft: 15 }}>
                            <Outlet />
                        </section>
                    </Flex>
                </main>
            </Flex>
            <Footer />
        </>
    )
}

export default InfoTemplate