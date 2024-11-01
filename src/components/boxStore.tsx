import { Link } from "react-router-dom"
import styled from "styled-components"
import { convertUrl } from "~/services/constants"
import { PATH } from "~/services/constants/navbarList"
import { StoreInfo } from "~/services/types/store"

const Content = styled.div`
    display: flex;
    gap: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
`

const Image = styled.img`
    width: 40%;
    object-fit: cover;
`

const ContentText = styled.div`
    flex: 1;

    h4 {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 10px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const LinkDetail = styled(Link)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
`

const BoxStore = ({ data }: { data: StoreInfo }) => {
    return (
        <Content>
            <Image src={convertUrl(data.store_image as string)} />
            <ContentText>
                <h4>{data.store_title}</h4>
                <p>
                    Tài liệu: {data.documents.length}
                </p>
            </ContentText>
            <LinkDetail to={PATH.DETAIL_STORE.replace(':id', data.store_Id as string)} />
        </Content>
    )
}

export default BoxStore