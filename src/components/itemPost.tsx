import { Typography } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import HtmlContent from '~/components/htmlContent'
import { PATH } from '~/services/constants/navbarList'
import { Post } from '~/services/types/post'

const Group = styled.div`
    margin: 10px 0;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
`

const Title = styled(Link)`
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 2px;
    color: #000;
`

const ItemPost = ({ data }: { data: Post }) => {
    return (
        <Group>
            <Title to={`${PATH.DETAIL_POST.replace(':id', data.post_Id as string)}`}>{data.post_title}</Title>
            <Typography.Paragraph
                ellipsis={{ rows: 4, expandable: false }}
                style={{ paddingTop: '6px' }}
            >
                <HtmlContent htmlContent={data.post_content} />
            </Typography.Paragraph>
        </Group>
    )
}

export default ItemPost