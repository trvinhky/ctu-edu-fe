import { Flex } from "antd"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import { useGlobalDataContext } from "~/hooks/globalData"
import HeaderShort from "~/layouts/HeaderShort"
import AccountAPI from "~/services/actions/account"
import { PATH } from "~/services/constants/navbarList"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"
import { actions as actionsAccount } from '~/services/reducers/accountSlice';

const GuardTemplate = () => {
    const token = useSelector(accountTokenSelector)
    const account = useSelector(accountInfoSelector)
    const { setIsLoading } = useGlobalDataContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || (account && account.role?.role_name.indexOf('user') !== -1)) {
            navigate(PATH.LOGIN)
        } else {
            if (!account) {
                getInfo()
            }
        }
    }, [token, account])

    const getInfo = async () => {
        try {
            setIsLoading(true)
            const { data } = await AccountAPI.getOne()
            setIsLoading(false)
            if (data && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                if (data.role?.role_name.indexOf('user') !== -1) {
                    navigate(PATH.LOGIN)
                }
            } else {
                navigate(PATH.LOGIN)
            }
        } catch (e) {
            navigate(PATH.LOGIN)
        }
    }

    return (
        <>
            <HeaderShort />
            <Flex
                align="center"
                justify="center"
                style={{ padding: '30px 0' }}
            >
                <main className="container">
                    <Outlet />
                </main>
            </Flex>
        </>
    )
}

export default GuardTemplate