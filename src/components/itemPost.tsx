import { Avatar, Flex, Typography } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import HtmlContent from '~/components/htmlContent'
import { PATH } from '~/services/constants/navbarList'
import { PostInfo } from '~/services/types/post'
import avatarImage from '~/assets/images/avatar.jpg'

const Group = styled.div`
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Title = styled(Link)`
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 2px;
    color: #000;
    display: -webkit-box;
    max-width: 100%;
    margin: 0 auto;
    line-height: 1;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Name = styled.span`
    display: block;
    color: #c0392b;
`

const ItemPost = ({ data }: { data: PostInfo }) => {

    return (
        <Group>
            <Flex gap={10}>
                <Avatar src={avatarImage} />
                <div style={{ flex: 1 }}>
                    <Name>{data.account?.account_name}</Name>
                    <Title to={`${PATH.DETAIL_POST.replace(':id', data.post_Id as string)}`}>{data.post_title}</Title>
                </div>
            </Flex>
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