import { Col, Row } from 'antd'
import CardCount from '~/components/cardCount'
import { useEffect, useState } from 'react'
import { Title } from '~/services/constants/styled'
import { useGlobalDataContext } from '~/hooks/globalData'
import AccountAPI from '~/services/actions/account'
import { PATH, pathAdmin } from '~/services/constants/navbarList'

const Admin = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [accountTotal, setAccountTotal] = useState(0)

    useEffect(() => {
        document.title = 'Admin'
        getAllTotal()
    }, [])

    const getAllTotal = async () => {
        setIsLoading(true)
        try {
            const accCount = await AccountAPI.getAll()
            if (accCount.status === 201 && !Array.isArray(accCount.data)) {
                setAccountTotal(accCount.data.count)
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
        <section className="admin">
            <Title>Trang chủ Admin</Title>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <CardCount
                        count={accountTotal}
                        href={`${pathAdmin(PATH.MANAGER_LESSON)}`}
                        title='Tài khoản'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={100}
                        href='/'
                        title='Bài học'
                        color='#2ecc71'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={20}
                        href={`${pathAdmin(PATH.MANAGER_COURSE)}`}
                        title='Khóa học'
                        color='#1abc9c'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={15}
                        href={`${pathAdmin(PATH.MANAGER_QUESTION)}`}
                        title='Câu hỏi'
                        color='#f1c40f'
                    />
                </Col>
            </Row>
        </section>
    )
}

export default Admin