import { Outlet } from "react-router-dom"
import NavbarIndividual from "~/components/navbarIndividual"
import HeaderAdmin from "~/layouts/HeaderAdmin"
import { Flex } from "antd"
import { NAVBARADMIN } from "~/services/constants/navbarList"
import styled from "styled-components"

const Navbar = styled.div`
    width: 25%;
`

const AdminTemplate = () => {
    return (
        <Flex align="center" justify="center">
            <div className="container">
                <Flex>
                    <Navbar>
                        <NavbarIndividual
                            items={NAVBARADMIN}
                        />
                    </Navbar>
                    <main style={{ flex: 1 }}>
                        <HeaderAdmin />
                        <div style={{ padding: '15px' }}>
                            <Outlet />
                        </div>
                    </main>
                </Flex>
            </div>
        </Flex>
    )
}

export default AdminTemplate