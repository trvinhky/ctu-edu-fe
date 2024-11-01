import { Button, Flex } from "antd"
import { Link, Outlet, useNavigate } from "react-router-dom"
import styled from "styled-components"
import NavbarIndividual from "~/components/navbarIndividual"
import Footer from "~/layouts/Footer"
import Header from "~/layouts/Header"
import { NAVBARAUTH, NAVBARUSER, PATH } from "~/services/constants/navbarList"
import AccountAPI from '~/services/actions/account'
import { useDispatch, useSelector } from "react-redux"
import { useGlobalDataContext } from "~/hooks/globalData"
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import { useEffect, useState } from "react"
import { SettingOutlined } from "@ant-design/icons"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"

const Navbar = styled.div`
    width: 25%;
`

const BtnAdmin = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 999;
`

const AuthTemplate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsLoading } = useGlobalDataContext();
    const [userName, setUserName] = useState('')
    const [items, setItems] = useState(NAVBARUSER)
    const [isShowBtn, setIsShowBtn] = useState(false)
    const account = useSelector(accountInfoSelector)
    const token = useSelector(accountTokenSelector)

    const getInfo = async () => {
        try {
            setIsLoading(true)
            const { data } = await AccountAPI.getOne()
            setIsLoading(false)
            if (data && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setUserName(data.profile?.profile_name)
                if (data.account_admin) {
                    setItems(NAVBARAUTH)
                    setIsShowBtn(true)
                }
            } else {
                navigate(PATH.LOGIN)
            }
        } catch (e) {
            navigate(PATH.LOGIN)
        }
    }

    useEffect(() => {
        if (token) {
            if (account) {
                setIsShowBtn(account.account_admin as boolean)
                setUserName(account.profile.profile_name)
                if (account.account_admin) {
                    setItems(NAVBARAUTH)
                }
            } else {
                getInfo()
            }
        } else navigate(PATH.LOGIN)
    }, [account, token])

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
                                name={userName}
                            />
                        </Navbar>
                        <section style={{ flex: 1, paddingLeft: 15 }}>
                            <Outlet />
                        </section>
                    </Flex>
                </main>
            </Flex>
            <Footer />
            {
                isShowBtn &&
                <BtnAdmin>
                    <Button type="primary" shape="circle">
                        <Link to={PATH.ADMIN}>
                            <SettingOutlined />
                        </Link>
                    </Button>
                </BtnAdmin>
            }
        </>
    )
}

export default AuthTemplate