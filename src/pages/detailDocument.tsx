import { DollarOutlined, ExclamationCircleFilled, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Flex, Form, Input, List, Modal, Rate, Row, Tag, Typography } from "antd";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ViewPDF from "~/components/viewPDF";
import { useGlobalDataContext } from "~/hooks/globalData";
import { convertDate, convertUrl, DATEFORMAT_FULL, ENV } from "~/services/constants";
import { PATH } from "~/services/constants/navbarList";
import { Title } from "~/services/constants/styled";
import { accountInfoSelector, accountTokenSelector } from "~/services/reducers/selectors";
import { DocumentInfo } from "~/services/types/document";
import ButtonBack from "~/services/utils/buttonBack";
import AccountAPI from "~/services/actions/account";
import BuyAPI from "~/services/actions/buy";
import DocumentAPI from "~/services/actions/document";
import ReviewAPI, { ParamsReview } from "~/services/actions/review";
import { ReviewInfo } from "~/services/types/review";
import CardReview from "~/components/cardReview";
import { setInfo } from "~/services/reducers/accountSlice";
import CardDocument from "~/components/cardDocument";
import Marquee from 'react-fast-marquee';
import ViewIcon from "~/components/viewIcon";
import { toast } from "react-toastify";

type FieldType = {
    review_ratings?: number
    review_content?: string
};

const CustomTitle = styled(Title)`
    display: flex;
    gap: 5px;
    align-items: center;
`

const TitleSub = styled.div`
    font-weight: 600;
    border-left: 2px solid #f1c40f;
    padding-left: 10px;
    font-size: 20px;
    color: #000;
    display: inline-block;
    margin: 30px 0 20px;
`

const TitleOther = styled.h3`
    font-weight: 600;
    border-left: 2px solid #f1c40f;
    padding-left: 10px;
    font-size: 20px;
    color: #000;
    display: inline-block;
    margin-top: 20px;
    margin-bottom: 10px;
`

const TitleInfo = styled.h4`
    text-transform: uppercase;
    font-weight: 600;
    font-size: 20px;
`

const BoxDocInfo = styled.div`
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-top: 25px;
`

const SubText = styled.h5`
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
`

const TimeText = styled.span`
    display: block;
    text-align: right;
    color: #27ae60;
    font-weight: 500;
    font-style: italic;
`

interface ListText {
    title: string
    text: JSX.Element
}

const IconDoc = styled.span`
    font-size: 20px;
`

const BoxDownload = styled.div`
    font-size: 16px;
    display: flex;
    gap: 10px;
    align-items: center;
    color: #faad14;

    span {
        color: #000;
        font-weight: 500;
    }
`

const DetailDocument = () => {
    const [title, setTitle] = useState<string>()
    const { id } = useParams();
    const navigate = useNavigate()
    const { setIsLoading } = useGlobalDataContext();
    const [documentInfo, setDocumentInfo] = useState<DocumentInfo>()
    // const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const token = useSelector(accountTokenSelector)
    const account = useSelector(accountInfoSelector)
    const dispatch = useDispatch();
    const [accountId, setAccountId] = useState<string>()
    const [checkBuy, setCheckBuy] = useState<boolean>(false)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [form] = Form.useForm<FieldType>();
    const [countStar, setCountStar] = useState(3);
    const [reviews, setReviews] = useState<ReviewInfo[]>([])
    const [docOthers, setDocOthers] = useState<DocumentInfo[]>([])
    const [docStores, setDocStores] = useState<DocumentInfo[]>([])
    const [listText, setListText] = useState<ListText[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [isCheckReview, setIsCheckReview] = useState(false)

    useEffect(() => {
        if (id) {
            if (token) {
                if (account) {
                    setAccountId(account.account_Id)
                    checkReview(id, account.account_Id)
                } else getInfo()
            }
            getOneDocument(id)
        } else navigate(-1)
    }, [id, token, account, setAccountId])

    useEffect(() => {
        if (id) {
            getAllReview({
                page: pagination.current,
                limit: pagination.pageSize,
                document: id
            })
        }
    }, [id, pagination.current, pagination.pageSize])

    const getInfo = async () => {
        try {
            const { data, status } = await AccountAPI.getOne()
            if (status === 201) {
                dispatch(setInfo(data))
                setAccountId(data.account_Id)
                checkReview(id as string, data.account_Id)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
    }

    const checkReview = async (doc: string, acc: string) => {
        try {
            const { data, status } = await ReviewAPI.getAll({
                account: acc,
                document: doc
            })

            if (status === 201 && data.count > 0) {
                setIsCheckReview(true)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
    }

    const getAllDocOthers = async ({ id, auth, store }: { id?: string, auth?: string, store?: string }) => {
        setIsLoading(true)
        try {
            const { data, status } = await DocumentAPI.getAll({ id, auth, store })
            if (status === 201) {
                if (auth) setDocOthers(data.documents)
                else setDocStores(data.documents)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const getAllReview = async (params: ParamsReview) => {
        setIsLoading(true)
        try {
            const { data, status } = await ReviewAPI.getAll(params)
            if (status === 201) {
                setReviews(data.reviews)
                setPagination({
                    current: params.page ?? 1,
                    pageSize: params.limit ?? 6,
                    total: data.count
                })
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const checkBuyDocument = async (account_Id: string, document_Id: string) => {
        try {
            const { status, data } = await BuyAPI.getOne({
                document_Id,
                account_Id
            })
            if (status === 201 && data) setCheckBuy(true)
        } catch (e) {
            console.log(e)
        }
    }

    // const readFile = async (url: string) => {
    //     setIsLoading(true)
    //     try {
    //         const response = await fetch(`${ENV.BE_HOST}/file/read-pdf`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ fileName: url })
    //         })

    //         if (!response.ok) {
    //             messageApi.open({
    //                 type: 'error',
    //                 content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
    //                 duration: 3,
    //             });
    //             return
    //         }

    //         const data = await response.json()
    //         // Chuyển object sang Uint8Array
    //         const uint8Array = new Uint8Array(Object.values(data));

    //         // Tạo Blob từ Uint8Array
    //         const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });

    //         // Tạo URL từ Blob để có thể hiển thị trong iframe
    //         const newURL = URL.createObjectURL(pdfBlob);

    //         setPdfUrl(newURL);
    //     } catch (e) {
    //         messageApi.open({
    //             type: 'error',
    //             content: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
    //             duration: 3,
    //         });
    //     }
    //     setIsLoading(false)
    // }

    const getOneDocument = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await DocumentAPI.getOne(id)
            if (status === 201) {
                setDocumentInfo(data)
                setTitle(data.document_title)
                document.title = data.document_title
                setListText([
                    {
                        title: 'Định dạng',
                        text: <IconDoc><ViewIcon format={data.format.format_name} url={data.document_url} /></IconDoc>
                    },
                    {
                        title: 'Số trang',
                        text: <span>{(data.document_page).toString()}</span>
                    },
                    {
                        title: 'Dung lượng',
                        text: <span>{(data.document_capacity).toString() + ' KB'}</span>
                    },
                    {
                        title: 'Kho tài liệu',
                        text: <span>{data.store?.store_title as string}</span>
                    },
                    {
                        title: 'Năm xuất bản',
                        text: <span>{(data.document_year).toString()}</span>
                    },
                    {
                        title: 'Tác giả',
                        text: <span>{data.document_author}</span>
                    }
                ])
                await getAllDocOthers({
                    id, store: data.store_Id
                })
                await getAllDocOthers({
                    id, auth: data.document_author
                })
                // if (data.document_score > 0) {
                //     await readFile(data.document_url)
                // }
                if (accountId) {
                    await checkBuyDocument(accountId, data.document_Id as string)
                }
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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
                toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
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
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
    }

    const handleDownload = async () => {
        if (documentInfo && checkBuy) {
            await downloadFile(documentInfo.document_url)
        } else {
            if (token) {
                setIsModalOpen(true);
            } else navigate(PATH.LOGIN)
        }
    }

    const handleFillter = async () => {
        if (countStar) {
            await getAllReview({
                page: pagination.current,
                limit: pagination.pageSize,
                ratings: countStar
            })
        }
    }

    const payDocument = async (account_Id: string, document_Id: string, document_url: string) => {
        setIsLoading(true)
        try {
            const { status, message } = await BuyAPI.create({
                document_Id,
                account_Id
            })

            setIsLoading(false)
            if (status === 200 && document_url) {
                toast.success(message)
                await downloadFile(document_url)
            } else toast.error(message)
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const handleOk = async () => {
        if (
            documentInfo && account &&
            typeof account.account_score !== 'undefined' &&
            documentInfo.document_score <= account.account_score
        ) {
            await payDocument(
                account.account_Id,
                documentInfo.document_Id as string,
                documentInfo.document_url
            )
        } else {
            Modal.confirm({
                title: 'Số điểm tích lũy của bạn hiện tại không đủ! Bạn có muốn nạp thêm điểm không?',
                icon: <ExclamationCircleFilled />,
                content: <Tag color="orange" style={{ whiteSpace: "wrap" }}>Lưu ý: Ngoài cách kiểm điểm thông qua nạp tiền, bạn còn có thể đăng bài.</Tag>,
                cancelText: 'Thoát',
                onOk() {
                    navigate(PATH.POINT)
                },
                onCancel() { },
            })
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCreateReview = async () => {
        setIsLoading(true)
        try {
            const { review_content, review_ratings } = form.getFieldsValue()
            if (review_content && review_ratings) {
                const { status, message } = await ReviewAPI.create({
                    document_Id: id as string,
                    account_Id: account?.account_Id as string,
                    review_content,
                    review_ratings: review_ratings
                })

                if (status === 200) {
                    toast.success(message)
                    await getAllReview({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        document: id
                    })
                    setIsCheckReview(true)
                } else toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
        setIsShowModal(false)
        form.resetFields()
    }

    const handleCancelCreate = () => {
        setIsShowModal(false)
        form.resetFields()
    }

    return (
        <>
            {
                documentInfo &&
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Flex justify="flex-start">
                            <ButtonBack />
                        </Flex>
                        <CustomTitle>
                            {title}
                            <Tag icon={<DollarOutlined />} color="warning">
                                {documentInfo.document_score === 0 ? 'free' : documentInfo.document_score}
                            </Tag>
                        </CustomTitle>
                        <ViewPDF
                            pdfUrl={convertUrl(documentInfo.document_sub)}
                            height="70vh"
                        />
                        <Flex
                            justify="flex-end"
                            style={{ margin: '20px 0' }}
                        >
                            <Button
                                type="primary"
                                style={{
                                    background: '#27ae60',
                                    width: '100%',
                                    textTransform: 'uppercase',
                                    padding: '10px 0'
                                }}
                                onClick={handleDownload}
                            >
                                Tải xuống
                            </Button>
                        </Flex>
                        <Alert
                            banner
                            message={
                                <Marquee pauseOnHover gradient={false}>
                                    Tài liệu hạn chế xem trước, để xem đầy đủ mời bạn chọn Tải xuống.
                                </Marquee>
                            }
                            style={{
                                marginBottom: 25
                            }}
                        />
                        <TitleInfo>
                            THÔNG TIN TÀI LIỆU
                        </TitleInfo>
                        <BoxDocInfo>
                            <SubText>
                                Thông tin cơ bản
                            </SubText>
                            <List
                                header={null}
                                footer={null}
                                bordered
                                dataSource={listText}
                                renderItem={(item) => (
                                    <List.Item key={item.title} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography.Text code>[{item.title}]</Typography.Text> {item.text}
                                    </List.Item>
                                )}
                            />
                        </BoxDocInfo>
                        <BoxDocInfo>
                            <SubText>
                                Nội dung
                            </SubText>
                            <p>
                                {documentInfo.document_content}
                            </p>
                            <TimeText>
                                Ngày đăng: {convertDate((documentInfo.createdAt as Date).toString(), DATEFORMAT_FULL)}
                            </TimeText>
                        </BoxDocInfo>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <TitleSub>Tất cả đánh giá</TitleSub>
                                <Flex align="center" justify="space-between" gap={15} style={{ paddingBottom: 20 }}>
                                    <Flex align="center" gap={10} >
                                        <Rate allowHalf onChange={setCountStar} value={countStar} />
                                        <Button
                                            type="primary"
                                            onClick={handleFillter}
                                        >
                                            <FilterOutlined />
                                        </Button>
                                    </Flex>
                                    {
                                        !isCheckReview && !checkBuy &&
                                        <Button
                                            type="primary"
                                            style={{
                                                backgroundColor: '#44bd32'
                                            }}
                                            onClick={() => setIsShowModal(true)}
                                        >
                                            <PlusOutlined />
                                        </Button>
                                    }
                                </Flex>
                                {
                                    reviews?.map((review) => (
                                        <Col key={review.review_Id} span={12}>
                                            <CardReview
                                                data={review}
                                            />
                                        </Col>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div>
                            <TitleOther>Liên quan</TitleOther>
                            {
                                docStores.map((doc) => (
                                    <CardDocument data={doc} key={doc.document_Id} />
                                ))
                            }
                        </div>
                        <div style={{ paddingTop: 30 }}>
                            <TitleOther>Cùng tác giả</TitleOther>
                            {
                                docOthers.map((doc) => (
                                    <CardDocument data={doc} key={doc.document_Id} />
                                ))
                            }
                        </div>
                    </Col>
                </Row>
            }
            <Modal
                title="Tải xuống"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Hủy"
                okText="OK"
            >
                <BoxDownload>
                    <span>Giá tài liệu: </span> {documentInfo?.document_score}<DollarOutlined style={{ color: "#faad14" }} />
                </BoxDownload>
                <BoxDownload>
                    <span>Số điểm hiện có: </span> {account?.account_score}<DollarOutlined style={{ color: "#faad14" }} />
                </BoxDownload>
            </Modal>
            <Modal
                title="Tạo nhận xét"
                open={isShowModal}
                onOk={handleCreateReview}
                onCancel={handleCancelCreate}
                cancelText="Hủy"
                okText="OK"
            >
                <Form
                    form={form}
                    name="create-review"
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{}}
                >
                    <Form.Item<FieldType>
                        label="Số sao"
                        name="review_ratings"
                        required
                        style={{
                            marginBottom: 10
                        }}
                    >
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Nội dung"
                        name="review_content"
                        required
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default DetailDocument