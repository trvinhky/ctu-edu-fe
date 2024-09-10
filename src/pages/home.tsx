import { Col, Flex, Pagination, Row } from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'
import Card from '~/components/card'
import CardReview from '~/components/cardReview'
import { BoxTitle } from '~/services/constants/styled'
import ButtonLinkCustom from '~/services/utils/buttonLinkCustom'

const SubTitle = styled(BoxTitle)`
    font-size: 20px;
    padding-top: 20px;
`

const Home = () => {

    useEffect(() => {
        document.title = 'Trang chủ'
    }, [])

    return (
        <>
            <Flex
                align='center'
                justify='center'
                gap='10px'
                wrap='wrap'
                style={{
                    paddingBottom: '20px'
                }}
            >
                <ButtonLinkCustom href='/field/jkjkb'>
                    Download
                </ButtonLinkCustom>
                <ButtonLinkCustom href='/field/jkjkb'>
                    Download
                </ButtonLinkCustom>
            </Flex>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
            </Row>
            <SubTitle>
                Review nổi bật
            </SubTitle>
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
        </>
    )
}

export default Home