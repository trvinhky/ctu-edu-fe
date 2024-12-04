import { Flex } from "antd"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import { useGlobalDataContext } from "~/hooks/globalData"
import HeaderShort from "~/layouts/HeaderShort"
import AccountAPI from "~/services/actions/account"
import { PATH } from "~/services/constants/navbarList"
import { setInfo } from "~/services/reducers/accountSlice"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"

const GuardTemplate = ({ isUser }: { isUser?: boolean }) => {
    const token = useSelector(accountTokenSelector)
    const account = useSelector(accountInfoSelector)
    const { setIsLoading } = useGlobalDataContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            if (account) {
                if (!isUser && !account.account_admin) {
                    navigate(PATH.LOGIN)
                }
            } else getInfo()
        } else navigate(PATH.LOGIN)
    }, [token, account, isUser])

    const getInfo = async () => {
        setIsLoading(true)
        try {
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201) {
                dispatch(setInfo(data))
                if (!isUser && !data.account_admin) {
                    navigate(PATH.LOGIN)
                }
            } else {
                navigate(PATH.LOGIN)
            }
        } catch (e) {
            navigate(PATH.LOGIN)
        }
        setIsLoading(false)
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