import { Col, Flex, Pagination, Row } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '~/components/card'
import CardReview from '~/components/cardReview'
import { useGlobalDataContext } from '~/hooks/globalData'
import SubjectAPI from '~/services/actions/subject'
import { PATH } from '~/services/constants/navbarList'
import { BoxTitle } from '~/services/constants/styled'
import { SubjectInfo } from '~/services/types/subject'
import ButtonLinkCustom from '~/services/utils/buttonLinkCustom'

const SubTitle = styled(BoxTitle)`
    font-size: 20px;
    padding-top: 20px;
`

const Home = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listSubjects, setListSubjects] = useState<SubjectInfo[]>()

    useEffect(() => {
        document.title = 'Trang chủ'
        getAllSubject()
    }, [])

    const getAllSubject = async (page?: number, limit: number = 6) => {
        setIsLoading(true)
        try {
            const { status, data, message } = await SubjectAPI.getAll(page, limit)
            if (status === 201 && !Array.isArray(data)) {
                setListSubjects(data.subjects)
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
            <Flex
                align='center'
                justify='center'
                gap='10px'
                wrap='wrap'
                style={{
                    paddingBottom: '20px'
                }}
            >
                {
                    listSubjects?.map((subject) => (
                        <ButtonLinkCustom
                            href={`${PATH.SUBJECT.replace(':id', subject.subject_Id as string)}`}
                            key={subject.subject_Id}
                        >
                            {subject.subject_name}
                        </ButtonLinkCustom>
                    ))
                }
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