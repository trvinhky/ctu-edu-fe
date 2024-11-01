import { DollarOutlined } from "@ant-design/icons"
import { Col, Row } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useGlobalDataContext } from "~/hooks/globalData"
import RechargeAPI from "~/services/actions/recharge"
import { formatCurrency } from "~/services/constants"
import { PATH } from "~/services/constants/navbarList"
import { Title } from "~/services/constants/styled"
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors"
import { Recharge } from "~/services/types/recharge"
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import AccountAPI from "~/services/actions/account"

const CardPoint = styled.div`
    border: 1px solid rgba(243, 156, 18, 0.4);
    text-align: center;
    padding: 15px;
    border-radius: 10px;
    cursor: pointer;

    &>span {
        display: block;
        margin-bottom: 15px;
        font-weight: 600;
        font-size: 20px;
    }

    .icon {
        font-size: 50px;
        color: #f1c40f;
    }

    .money {
        color: #c0392b;
    }
`

const Point = () => {
    const [recharges, setRecharges] = useState<Recharge[]>()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const navigate = useNavigate();
    const account = useSelector(accountInfoSelector)
    const dispatch = useDispatch();
    const token = useSelector(accountTokenSelector)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [accountId, setAccountId] = useState<string>()
    const title = "Nạp điểm"

    useEffect(() => {
        document.title = title
        getAllRecharge(pagination.current, pagination.pageSize)
        if (token) {
            if (!account) {
                getInfo()
            }
        } else {
            navigate(PATH.LOGIN)
        }
    }, [pagination.current, pagination.pageSize, token, account])

    const getInfo = async () => {
        try {
            setIsLoading(true)
            const { data, status } = await AccountAPI.getOne()
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setAccountId(data.account_Id)
            } else {
                navigate(PATH.LOGIN)
            }
        } catch (e) {
            navigate(PATH.LOGIN)
        }
    }

    const getAllRecharge = async (page?: number, limit?: number) => {
        setIsLoading(true)
        try {
            const { data, message, status } = await RechargeAPI.getAll(page, limit)
            if (status === 201 && !Array.isArray(data)) {
                setRecharges(data.recharges)

                setPagination({
                    current: page ?? 1,
                    pageSize: limit ?? 6,
                    total: data.count
                })
            } else {
                messageApi.open({
                    type: 'error',
                    content: message,
                    duration: 3,
                });
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    const handlePayment = async (id: string, amount: number) => {
        const account_Id = account ? account.account_Id : accountId
        setIsLoading(true)
        try {
            const { message, status, data } = await RechargeAPI.payment(amount)
            if (status === 201 && !Array.isArray(data)) {
                console.log(data)
                if (data.resultCode !== 0) {
                    messageApi.open({
                        type: 'error',
                        content: data.message,
                        duration: 3,
                    });
                } else location.href = data.shortLink
            } else {
                messageApi.open({
                    type: 'error',
                    content: message,
                    duration: 3,
                });
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }

    return (
        <section>
            <Title>{title}</Title>
            <Row gutter={[16, 16]}>
                {
                    recharges?.map((item) => (
                        <Col span={6} key={item.recharge_Id}>
                            <CardPoint
                                onClick={() => handlePayment(
                                    item.recharge_Id as string,
                                    item.recharge_money
                                )}
                            >
                                <span className="icon">
                                    <DollarOutlined />
                                </span>
                                <span className="money">
                                    {
                                        formatCurrency(item.recharge_money)
                                    }
                                </span>
                                <span className="point">
                                    {item.recharge_score}
                                </span>
                            </CardPoint>
                        </Col>
                    ))
                }
            </Row>
        </section>
    )
}

export default Point