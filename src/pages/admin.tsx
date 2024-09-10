import { Col, Row } from 'antd'
import CardCount from '~/components/cardCount'
import { useEffect } from 'react'
import { Title } from '~/services/constants/styled'

const Admin = () => {

    useEffect(() => {
        document.title = 'Admin'
    }, [])

    return (
        <section className="admin">
            <Title>Trang chủ Admin</Title>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <CardCount
                        count={10}
                        href='/'
                        title='Giảng viên'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={100}
                        href='/'
                        title='Học viên'
                        color='#2ecc71'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={20}
                        href='/'
                        title='Khóa học'
                        color='#1abc9c'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={289}
                        href='/'
                        title='Bài học'
                        color='#e67e22'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={15}
                        href='/'
                        title='Review'
                        color='#f1c40f'
                    />
                </Col>
            </Row>
        </section>
    )
}

export default Admin