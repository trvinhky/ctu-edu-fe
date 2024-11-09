import { Avatar, Flex, Typography } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import HtmlContent from '~/components/htmlContent'
import { PATH } from '~/services/constants/navbarList'
import { PostInfo } from '~/services/types/post'
import avatarImage from '~/assets/images/avatar.jpg'
import { convertUrl } from '~/services/constants'

const Group = styled.div`
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

const Name = styled.span`
    display: block;
    color: #c0392b;
`

const ItemPost = ({ data }: { data: PostInfo }) => {
    const imageSrc = convertUrl(data.account?.profile?.profile_avatar as string)

    return (
        <Group>
            <Flex gap={10}>
                <Avatar src={imageSrc?.includes('null') ? avatarImage : imageSrc as string} />
                <div>
                    <Name>{data.account?.profile?.profile_name}</Name>
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