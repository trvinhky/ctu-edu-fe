import { Outlet, useNavigate } from "react-router-dom"
import NavbarIndividual from "~/components/navbarIndividual"
import HeaderAdmin from "~/layouts/HeaderAdmin"
import { Flex } from "antd"
import { NAVBARADMIN, PATH } from "~/services/constants/navbarList"
import styled from "styled-components"
import AccountAPI from '~/services/actions/account'
import { useDispatch } from "react-redux"
import { useGlobalDataContext } from "~/hooks/globalData"
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import { useEffect, useState } from "react"

const Navbar = styled.div`
    width: 25%;
`

const AdminTemplate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsLoading } = useGlobalDataContext();
    const [userName, setUserName] = useState('')

    const getInfoAdmin = async () => {
        try {
            setIsLoading(true)
            const { data } = await AccountAPI.getOne()
            setIsLoading(false)
            if (data && !Array.isArray(data)) {
                if (data.role?.role_name.indexOf('admin') !== -1) {
                    dispatch(actionsAccount.setInfo(data))
                    setUserName(data.profile?.profile_name)
                } else {
                    navigate(PATH.LOGIN_ADMIN)
                }
            } else {
                navigate(PATH.LOGIN_ADMIN)
            }
        } catch (e) {
            navigate(PATH.LOGIN_ADMIN)
        }
    }

    useEffect(() => {
        getInfoAdmin()
    }, [])

    return (
        <Flex align="center" justify="center">
            <div className="container">
                <Flex>
                    <Navbar>
                        <NavbarIndividual
                            items={NAVBARADMIN}
                            name={userName}
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