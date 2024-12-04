import { Link } from "react-router-dom"
import styled from "styled-components"
import HtmlContent from "~/components/htmlContent"
import { PATH } from "~/services/constants/navbarList"
import { PostInfo } from "~/services/types/post"

const BoxDoc = styled.div`
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-top: 15px;
    display: block; 
    color: #000;

    p {
        font-weight: 16px;
        display: block;
        display: -webkit-box;
        max-width: 100%;
        margin: 0 auto;
        line-height: 1;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const Title = styled(Link)`
    cursor: pointer;
    color: #000;
    font-size: 18px;
    font-weight: 600;
    display: block;
    display: -webkit-box;
    max-width: 100%;
    margin: 0 auto;
    line-height: 1;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
`

const CardPost = ({ data }: { data: PostInfo }) => {
    return (
        <BoxDoc>
            <Title to={PATH.DETAIL_POST.replace(':id', data.post_Id as string)}>{data.post_title}</Title>
            <p>
                {data.post_content && <HtmlContent htmlContent={data.post_content} />}
            </p>
        </BoxDoc>
    )
}

export default CardPost