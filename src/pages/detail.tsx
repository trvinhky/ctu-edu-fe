import { CaretRightOutlined, StarFilled } from "@ant-design/icons"
import { Button, Col, Flex, Pagination, Rate, Row } from "antd"
import { useEffect, useState } from "react"
import ReactQuill from "react-quill"
import styled from "styled-components"
import cardImg from '~/assets/images/work.jpeg'
import CardReview from "~/components/cardReview"
import { BoxTitle } from "~/services/constants/styled"
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom"

const Info = styled.div`
    font-size: 18px;
`

const Image = styled.span`
    display: block;
    border-radius: 10px;
    overflow: hidden;

    img {
        width: 100%;
        object-fit: cover;
    }
`

const BoxText = styled.p`
    span {
        font-weight: 600;
    }
`

const SubTitle = styled(BoxTitle)`
    font-size: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 10px;
    margin-top: 20px;
`

const BoxReview = styled.div`
    padding-bottom: 20px;

    h6 {
        padding-bottom: 10px;
        font-weight: 600;
        font-size: 16px;
    }
`

const WrapperBox = styled.div`
    padding: 15px 0 60px;
`

const Detail = () => {
    const [contentReview, setContentReview] = useState('');
    useEffect(() => {
        document.title = 'Lập trình Web với ReactJS'
    }, [])

    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Info>
                    <Image>
                        <img src={cardImg} alt="" />
                    </Image>
                    <BoxText>
                        <span>Người dạy: </span>Jack
                    </BoxText>
                    <BoxText>
                        <span>Đánh giá: </span>5<StarFilled style={{ color: '#f1c40f' }} />
                    </BoxText>
                    <BoxText>
                        <span>Phí đăng ký: </span>Miễn phí
                    </BoxText>
                    <BoxText>
                        <span>Yêu cầu: </span>Không
                    </BoxText>
                    <BoxText>
                        <span>Ngày tạo: </span>06/09/2024
                    </BoxText>
                    <BoxText>
                        <span>Cập nhật gần nhất: </span>06/09/2024
                    </BoxText>
                </Info>
            </Col>
            <Col span={16}>
                <BoxTitle>
                    Lập trình Web với ReactJS
                </BoxTitle>
                <Flex align="center" justify="center">
                    <ButtonLinkCustom
                        href="/field/addada"
                    >
                        Công Nghệ Thông Tin
                    </ButtonLinkCustom>
                </Flex>
                <div style={{ fontSize: '18px', paddingTop: '15px' }}>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis cum facere velit labore perferendis eaque ea facilis, distinctio, eius ut odit error voluptates amet corporis illum quibusdam. Ab, totam molestias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore dolorem maxime in quisquam vero magni excepturi deleniti dolorum itaque. Error corporis et quis delectus nisi harum pariatur debitis ratione? Cumque.</p>
                </div>
            </Col>
            <Col span={24}>
                <Flex justify="flex-end" gap={10}>
                    <ButtonLinkCustom href="/course/hgbkh" shape="default">
                        Xem thông tin <CaretRightOutlined />
                    </ButtonLinkCustom>
                    <Button type="primary">
                        Đăng ký <CaretRightOutlined />
                    </Button>
                </Flex>
            </Col>
            <Col span={24}>
                <SubTitle>Review</SubTitle>
            </Col>
            <Col span={24}>
                <BoxReview>
                    <h6>Tạo review</h6>
                    <Rate allowHalf defaultValue={2.5} />
                    <WrapperBox>
                        <ReactQuill
                            theme="snow"
                            value={contentReview}
                            onChange={setContentReview}
                            style={{ height: '40vh' }}
                        />
                    </WrapperBox>
                    <Flex
                        justify="flex-end"
                    >
                        <Button type="primary">
                            Tạo mới
                        </Button>
                    </Flex>
                </BoxReview>
            </Col>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <CardReview />
                </Col>
                <Col span={12}>
                    <CardReview />
                </Col>
                <Col span={24}>
                    <Flex align='center' justify='center'>
                        <Pagination defaultCurrent={1} total={50} />
                    </Flex>
                </Col>
            </Row>
        </Row>
    )
}

export default Detail