import { Result, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGlobalDataContext } from "~/hooks/globalData";
import HistoryAPI from "~/services/actions/history";
import { PATH } from "~/services/constants/navbarList";
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom";

const CheckOrder = () => {
    const { setIsLoading } = useGlobalDataContext();
    const [messageFeedback, setMessageFeedback] = useState<string>()
    const [code, setCode] = useState<number>(0)
    const [searchParams] = useSearchParams();
    const order = searchParams.get('orderId');

    const checkStatusOrder = async (order: string) => {
        setIsLoading(true)
        try {
            const { data, message } = await HistoryAPI.checkStatus(order)

            setMessageFeedback(message as string)
            setCode(data.code === 0 || data.code === 9000 ? 0 : -1)
        } catch (e) {
            setMessageFeedback('Lỗi server!')
            setCode(-1)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        document.title = "Kiểm tra thanh toán"
        if (order)
            checkStatusOrder(order)
    }, [order])

    return (
        <>
            <Typography.Title
                style={{
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    margin: 0
                }}
                level={3}
            >
                Kiểm tra thanh toán
            </Typography.Title>
            <Result
                status={code === 0 ? "success" : 'error'}
                title={messageFeedback}
                subTitle="Quá trình xử lý có thể mất vài phút! bạn có thể load lại trang để kiểm tra."
                extra={
                    <ButtonLinkCustom
                        href={`${PATH.AUTH}/${PATH.LIST_HISTORY}`}
                        shape="default"
                    >
                        Xem lịch sử nạp
                    </ButtonLinkCustom>
                }
            />
        </>
    )
}

export default CheckOrder