import { Col, List, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import CardPost from "~/components/cardPost";
import FacebookComments from "~/components/facebookComments";
import HtmlContent from "~/components/htmlContent";
import ViewIcon from "~/components/viewIcon";
import ViewPDF from "~/components/viewPDF";
import { useGlobalDataContext } from "~/hooks/globalData";
import PostAPI from "~/services/actions/post";
import { convertDate, convertUrl, DATEFORMAT_FULL } from "~/services/constants";
import { Title } from "~/services/constants/styled";
import { PostInfo } from "~/services/types/post";

const TitleInfo = styled.h4`
    text-transform: uppercase;
    font-weight: 600;
    font-size: 20px;
    margin-top: 30px;
`

const BoxDocInfo = styled.div`
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-top: 15px;
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

const DetailPost = () => {
    const [title, setTitle] = useState<string>()
    const { id } = useParams();
    const { setIsLoading } = useGlobalDataContext();
    const navigate = useNavigate()
    const [postInfo, setPostInfo] = useState<PostInfo>()
    const [listText, setListText] = useState<ListText[]>([])
    const [docOthers, setDocOthers] = useState<PostInfo[]>([])
    const [docAuths, setDocAuths] = useState<PostInfo[]>([])

    useEffect(() => {
        if (id) {
            getOnePost(id)
        } else navigate(-1)
    }, [id])

    const getOnePost = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await PostAPI.getOne(id)
            if (status === 201) {
                setPostInfo(data)
                document.title = data.post_title
                setTitle(data.post_title)
                setListText([
                    {
                        title: 'Định dạng',
                        text: <IconDoc><ViewIcon format={data.format.format_name} url={data.post_url as string} /></IconDoc>
                    },
                    {
                        title: 'Số trang',
                        text: <span>{(data.post_page as number).toString()}</span>
                    },
                    {
                        title: 'Dung lượng',
                        text: <span>{(data.post_capacity as number).toString() + ' KB'}</span>
                    },
                    {
                        title: 'Năm xuất bản',
                        text: <span>{(data.post_year).toString()}</span>
                    },
                    {
                        title: 'Tác giả',
                        text: <span>{data.post_author}</span>
                    }
                ])
                await getAllPostOthers({
                    id, auth: data.post_author
                })
                await getAllPostOthers({
                    id, account: data.account_Id
                })
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    const getAllPostOthers = async ({ id, auth, account }: { id?: string, auth?: string, account?: string }) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await PostAPI.getAll({ id, auth, account, index: 1 })
            if (status === 201) {
                if (account) setDocOthers(data.posts)
                else setDocAuths(data.posts)
            } else {
                toast.error(message)
            }
        } catch (e) {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại sau!')
        }
        setIsLoading(false)
    }

    return (
        <>
            {
                postInfo &&
                <section>
                    <Row gutter={[16, 16]}>
                        <Col span={16}>
                            <Title>
                                {title}
                            </Title>
                            <ViewPDF
                                pdfUrl={convertUrl(postInfo.post_sub as string)}
                                height="70vh"
                            />
                            <TitleInfo>
                                THÔNG TIN BÀI ĐĂNG
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
                                    Mô tả
                                </SubText>
                                <p>
                                    {postInfo?.post_content && <HtmlContent htmlContent={postInfo?.post_content} />}
                                </p>
                                <TimeText>
                                    Ngày đăng: {convertDate((postInfo.createdAt as Date).toString(), DATEFORMAT_FULL)}
                                </TimeText>
                            </BoxDocInfo>
                            <Row gutter={[16, 16]}>
                                <Col span={24} style={{ marginTop: 40 }}>
                                    <FacebookComments path={`post/${id}`} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <div>
                                <TitleOther>Liên quan</TitleOther>
                                {
                                    docOthers.map((post) => (
                                        <CardPost data={post} key={post.post_Id} />
                                    ))
                                }
                            </div>
                            <div style={{ paddingTop: 30 }}>
                                <TitleOther>Cùng tác giả</TitleOther>
                                {
                                    docAuths.map((post) => (
                                        <CardPost data={post} key={post.post_Id} />
                                    ))
                                }
                            </div>
                        </Col>
                    </Row>

                </section>
            }
        </>
    )
}

export default DetailPost