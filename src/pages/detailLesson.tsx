import { DollarOutlined } from "@ant-design/icons";
import { Button, Flex, Tag } from "antd";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ViewPDF from "~/components/viewPDF";
import { useGlobalDataContext } from "~/hooks/globalData";
import LessonAPI from "~/services/actions/lesson";
import { convertUrl, ENV } from "~/services/constants";
import { PATH } from "~/services/constants/navbarList";
import { Title } from "~/services/constants/styled";
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors";
import { LessonInfo } from "~/services/types/lesson";
import ButtonBack from "~/services/utils/buttonBack";
import { actions as actionsAccount } from '~/services/reducers/accountSlice';
import AccountAPI from "~/services/actions/account";
import BuyAPI from "~/services/actions/buy";

const CustomTitle = styled(Title)`
    display: flex;
    gap: 5px;
    align-items: center;
`

const DetailLesson = () => {
    const [title, setTitle] = useState<string>()
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [lessonInfo, setLessonInfo] = useState<LessonInfo>()
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const token = useSelector(accountTokenSelector)
    const account = useSelector(accountInfoSelector)
    const dispatch = useDispatch();
    const [accountId, setAccountId] = useState<string>()
    const [checkBuy, setCheckBuy] = useState<boolean>(false)

    useEffect(() => {
        if (id) {
            if (token) {
                if (account) setAccountId(account.account_Id)
                else getInfo()
            }
            getOneLesson(id)
        } else navigate(-1)
    }, [id, token, account, setAccountId])

    const getInfo = async () => {
        try {
            setIsLoading(true)
            const { data } = await AccountAPI.getOne()
            setIsLoading(false)
            if (data && !Array.isArray(data)) {
                dispatch(actionsAccount.setInfo(data))
                setAccountId(data.account_Id)
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const checkBuyLesson = async (student_Id: string, lesson_Id: string) => {
        try {
            setIsLoading(true)
            const { status, data } = await BuyAPI.getOne({
                lesson_Id,
                student_Id
            })
            setIsLoading(false)
            if (status === 201 && !Array.isArray(data)) {
                if (data) {
                    setCheckBuy(true)
                } else setCheckBuy(false)
            }
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const readFile = async (url: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${ENV.BE_HOST}/file/read-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName: url })
            })

            if (!response.ok) {
                messageApi.open({
                    type: 'error',
                    content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                    duration: 3,
                });
                return
            }

            const data = await response.json()
            // Chuyển object sang Uint8Array
            const uint8Array = new Uint8Array(Object.values(data));

            // Tạo Blob từ Uint8Array
            const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });

            // Tạo URL từ Blob để có thể hiển thị trong iframe
            const newURL = URL.createObjectURL(pdfBlob);

            setPdfUrl(newURL);
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
        setIsLoading(false)
    }


    const getOneLesson = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await LessonAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setLessonInfo(data)
                setTitle(data.lesson_title)
                document.title = data.lesson_title
                if (data.lesson_score > 0) {
                    await readFile(data.lesson_url)
                }
                if (accountId)
                    await checkBuyLesson(accountId, data.lesson_Id as string)
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

    const downloadFile = async (fileName: string) => {
        try {
            const response = await fetch(`${ENV.BE_HOST}/file/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fileName: fileName })
            })

            if (!response.ok) {
                messageApi.open({
                    type: 'error',
                    content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                    duration: 3,
                });
                return
            }

            const parts = fileName.split('\\');

            const blob = await response.blob(); // Chuyển dữ liệu thành blob (Binary Large Object)
            const url = window.URL.createObjectURL(blob); // Tạo URL từ blob
            const link = document.createElement('a'); // Tạo thẻ <a> tạm để tải file
            link.href = url;
            link.download = parts[parts.length - 1]; // Tên file tải về
            document.body.appendChild(link);
            link.click(); // Tự động click vào thẻ <a> để tải file
            link.remove(); // Xóa thẻ sau khi tải xong
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
                duration: 3,
            });
        }
    }

    const handleDownload = async () => {
        if (lessonInfo && (lessonInfo?.lesson_score <= 0 || checkBuy)) {
            await downloadFile(lessonInfo.lesson_url)
        } else
            navigate(PATH.BUY.replace(':id', lessonInfo?.lesson_Id as string))
    }

    return (
        <>
            {
                lessonInfo &&
                <section>
                    <Flex justify="flex-start">
                        <ButtonBack />
                    </Flex>
                    <CustomTitle>
                        {title}
                        <Tag icon={<DollarOutlined />} color="warning">
                            {lessonInfo.lesson_score === 0 ? 'free' : lessonInfo.lesson_score}
                        </Tag>
                    </CustomTitle>
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="600px"
                            title={title}
                        />
                    ) : lessonInfo.lesson_score === 0 ?
                        (
                            <ViewPDF
                                pdfUrl={convertUrl(lessonInfo.lesson_url)}
                                height="70vh"
                            />
                        ) :
                        (
                            <p>Loading PDF...</p>
                        )
                    }
                    <Flex
                        justify="flex-end"
                        style={{ padding: '15px 0 20px' }}
                    >
                        <Button
                            type="primary"
                            style={{
                                background: '#27ae60'
                            }}
                            onClick={handleDownload}
                        >
                            Tải file
                        </Button>
                    </Flex>
                    <p>
                        {lessonInfo.lesson_content}
                    </p>
                </section>
            }
        </>
    )
}

export default DetailLesson