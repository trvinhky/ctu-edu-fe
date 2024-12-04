import { Outlet, useNavigate } from "react-router-dom"
import NavbarIndividual from "~/components/navbarIndividual"
import HeaderAdmin from "~/layouts/HeaderAdmin"
import { Flex } from "antd"
import { NAVBARADMIN, PATH } from "~/services/constants/navbarList"
import styled from "styled-components"
import AccountAPI from '~/services/actions/account'
import { useDispatch, useSelector } from "react-redux"
import { useGlobalDataContext } from "~/hooks/globalData"
import { useEffect, useState } from "react"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"
import { setInfo } from "~/services/reducers/accountSlice"

const Navbar = styled.div`
    width: 25%;
`

const AdminTemplate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsLoading } = useGlobalDataContext();
    const [userName, setUserName] = useState('')
    const account = useSelector(accountInfoSelector)
    const token = useSelector(accountTokenSelector)

    const getInfoAdmin = async () => {
        setIsLoading(true)
        try {
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201) {
                if (data.account_admin) {
                    dispatch(setInfo(data))
                    setUserName(data.account_name)
                    return
                }
            }
            navigate(PATH.LOGIN)
        } catch (e) {
            navigate(PATH.LOGIN)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (token) {
            if (account) {
                setUserName(account.account_name)
            } else {
                getInfoAdmin()
            }
        } else navigate(PATH.LOGIN)
    }, [account, token])

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