import { Col, Row } from 'antd'
import CardCount from '~/components/cardCount'
import { useEffect, useState } from 'react'
import { Title } from '~/services/constants/styled'
import { useGlobalDataContext } from '~/hooks/globalData'
import AccountAPI from '~/services/actions/account'
import { PATH, pathAdmin } from '~/services/constants/navbarList'
import DocumentAPI from '~/services/actions/document'
import PostAPI from '~/services/actions/post'
import StoreAPI from '~/services/actions/store'

const Admin = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [accountTotal, setAccountTotal] = useState(0)
    const [documentTotal, setDocumentTotal] = useState(0)
    const [postTotal, setPostTotal] = useState(0)
    const [storeTotal, setStoreTotal] = useState(0)

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

            const docCount = await DocumentAPI.getAll({ page: 1 })
            if (docCount.status === 201 && !Array.isArray(docCount.data)) {
                setDocumentTotal(docCount.data.count)
            }

            const postCount = await PostAPI.getAll({ page: 1 })
            if (postCount.status === 201 && !Array.isArray(postCount.data)) {
                setPostTotal(postCount.data.count)
            }

            const storeCount = await StoreAPI.getAll(1)
            if (storeCount.status === 201 && !Array.isArray(storeCount.data)) {
                setStoreTotal(storeCount.data.count)
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
                        href={`${pathAdmin(PATH.MANAGER_ACCOUNT)}`}
                        title='Tài khoản'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={documentTotal}
                        href={`${pathAdmin(PATH.MANAGER_DOCUMENT)}`}
                        title='Tài liệu'
                        color='#2ecc71'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={storeTotal}
                        href={`${pathAdmin(PATH.MANAGER_STORE)}`}
                        title='Kho tài liệu'
                        color='#1abc9c'
                    />
                </Col>
                <Col span={8}>
                    <CardCount
                        count={postTotal}
                        href={`${pathAdmin(PATH.MANAGER_POST)}`}
                        title='Bài đăng'
                        color='#f1c40f'
                    />
                </Col>
            </Row>
        </section>
    )
}

export default Admin