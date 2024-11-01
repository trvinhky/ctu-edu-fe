import { Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import BoxDocument from '~/components/boxDocument'
import BoxStore from '~/components/boxStore'
import ItemPost from '~/components/itemPost'
import { useGlobalDataContext } from '~/hooks/globalData'
import DocumentAPI from '~/services/actions/document'
import PostAPI from '~/services/actions/post'
import StoreAPI from '~/services/actions/store'
import { PATH } from '~/services/constants/navbarList'
import { TitleLink } from '~/services/constants/styled'
import { DocumentInfo } from '~/services/types/document'
import { PostInfo } from '~/services/types/post'
import { StoreInfo } from '~/services/types/store'

const Home = () => {
    const { setIsLoading, messageApi } = useGlobalDataContext();
    const [listPosts, setListPosts] = useState<PostInfo[]>([])
    const [listDocument, setListDocument] = useState<DocumentInfo[]>([])
    const [listStore, setListStore] = useState<StoreInfo[]>([])

    useEffect(() => {
        document.title = 'Trang chủ'
        getAllPost()
        getAllDocument()
        getAllStore()
    }, [])

    const getAllPost = async () => {
        setIsLoading(true)
        try {
            const { data, status, message } = await PostAPI.getAll({ page: 1, index: 1 })
            if (status === 201 && !Array.isArray(data)) {
                setListPosts(data.posts)
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

    const getAllDocument = async () => {
        setIsLoading(true)
        try {
            const { data, message, status } = await DocumentAPI.getAll({ page: 1 })
            if (status === 201 && !Array.isArray(data)) {
                setListDocument(data.documents)
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

    const getAllStore = async () => {
        setIsLoading(true)
        try {
            const { status, data, message } = await StoreAPI.getAll(1)
            if (status === 201 && !Array.isArray(data)) {
                setListStore(data.stores)
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
            <TitleLink to={PATH.SEARCH}>
                Kho tài liệu
            </TitleLink>
            <Row gutter={[16, 16]}>
                {
                    listStore?.map((store) => (
                        <Col span={6} key={store.store_Id}>
                            <BoxStore data={store} />
                        </Col>
                    ))
                }
            </Row>
            <TitleLink to={PATH.SEARCH}>
                Tài liệu
            </TitleLink>
            <Row gutter={[16, 16]}>
                {
                    listDocument?.map((doc) => (
                        <Col span={6} key={doc.document_Id}>
                            <BoxDocument data={doc} />
                        </Col>
                    ))
                }
            </Row>
            <TitleLink to={PATH.LIST_POST}>
                Bài viết
            </TitleLink>
            <Row gutter={[16, 16]}>
                {
                    listPosts?.map((post) => (
                        <Col span={12} key={post.post_Id}>
                            <ItemPost data={post} />
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default Home