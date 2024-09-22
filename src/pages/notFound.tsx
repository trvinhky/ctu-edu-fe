import { Result } from "antd"
import { PATH } from "~/services/constants/navbarList"
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom"

const NotFound = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi, Không tìm thấy trang bạn tìm."
            extra={
                <ButtonLinkCustom
                    href={PATH.HOME}
                    shape="default"
                >
                    Trở lại trang chủ
                </ButtonLinkCustom>
            }
        />
    )
}

export default NotFound