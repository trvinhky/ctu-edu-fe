import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import FacebookComments from "~/components/facebookComments";
import HtmlContent from "~/components/htmlContent";
import ViewPDF from "~/components/viewPDF";
import { useGlobalDataContext } from "~/hooks/globalData";
import PostAPI from "~/services/actions/post";
import { convertUrl } from "~/services/constants";
import { BoxTitle } from "~/services/constants/styled";
import { PostInfo } from "~/services/types/post";

const AuthText = styled.h4`
    text-align: right;
    font-weight: 600;
    margin-bottom: 30px;
`

const DetailPost = () => {
    const [title, setTitle] = useState<string>()
    const { id } = useParams();
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const navigate = useNavigate()
    const [postInfo, setPostInfo] = useState<PostInfo>()

    useEffect(() => {
        if (id) {
            getOnePost(id)
        } else navigate(-1)
    }, [id])

    const getOnePost = async (id: string) => {
        setIsLoading(true)
        try {
            const { status, message, data } = await PostAPI.getOne(id)
            if (status === 201 && !Array.isArray(data)) {
                setPostInfo(data)
                document.title = data.post_title
                setTitle(data.post_title)
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
        <>
            {
                postInfo &&
                <section>
                    <BoxTitle>
                        {title}
                    </BoxTitle>
                    {
                        postInfo.post_url &&
                        <ViewPDF
                            pdfUrl={convertUrl(postInfo.post_url)}
                            height="70vh"
                        />
                    }
                    <div style={{ fontSize: '18px', paddingTop: '15px' }}>
                        {postInfo?.post_content && <HtmlContent htmlContent={postInfo?.post_content} />}
                    </div>
                    <AuthText>
                        {postInfo.account.profile.profile_name}
                    </AuthText>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <FacebookComments path="post" />
                        </Col>
                    </Row>
                </section>
            }
        </>
    )
}

export default DetailPost