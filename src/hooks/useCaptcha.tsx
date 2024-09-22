import { useEffect, useState } from "react"
import { useGlobalDataContext } from "~/hooks/globalData";
import AccountAPI from "~/services/actions/account";
import { ENV } from "~/services/constants";

const useCaptcha = () => {
    const [captchaUrl, setCaptchaUrl] = useState<string | undefined>(undefined)
    const { setIsLoading, messageApi } = useGlobalDataContext();

    useEffect(() => {
        fetchCaptcha()
    }, [])

    const fetchCaptcha = async () => {
        setIsLoading(true)
        try {
            const { data } = await AccountAPI.getCaptCha()

            if (!Array.isArray(data)) {
                setCaptchaUrl(`${ENV.BE_HOST}${data.url}`);
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    };

    return [captchaUrl]
}

export default useCaptcha