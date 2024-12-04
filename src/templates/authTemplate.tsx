import { Button, Flex } from "antd"
import { Link, Outlet, useNavigate } from "react-router-dom"
import styled from "styled-components"
import NavbarIndividual from "~/components/navbarIndividual"
import Footer from "~/layouts/Footer"
import Header from "~/layouts/Header"
import { NAVBARAUTH, PATH } from "~/services/constants/navbarList"
import AccountAPI from '~/services/actions/account'
import { useDispatch, useSelector } from "react-redux"
import { useGlobalDataContext } from "~/hooks/globalData"
import { useEffect, useState } from "react"
import { SettingOutlined } from "@ant-design/icons"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"
import { setInfo } from "~/services/reducers/accountSlice"

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
    const [isShowBtn, setIsShowBtn] = useState(false)
    const account = useSelector(accountInfoSelector)
    const token = useSelector(accountTokenSelector)

    const getInfo = async () => {
        setIsLoading(true)
        try {
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201) {
                dispatch(setInfo(data))
                setUserName(data.account_name)
                if (data.account_admin) {
                    setIsShowBtn(true)
                }
            } else {
                navigate(PATH.LOGIN)
            }
        } catch (e) {
            navigate(PATH.LOGIN)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (token) {
            if (account) {
                setIsShowBtn(account.account_admin as boolean)
                setUserName(account.account_name)
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
                                items={NAVBARAUTH}
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