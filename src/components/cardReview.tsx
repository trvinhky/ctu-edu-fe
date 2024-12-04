import styled from 'styled-components';
import { ReviewInfo } from '~/services/types/review';
import avatarImage from '~/assets/images/avatar.jpg'
import { Avatar, Flex, Rate, Typography } from 'antd';
import HtmlContent from '~/components/htmlContent';
import { convertDate } from '~/services/constants';

const Group = styled.div`
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
`

const Name = styled.span`
    display: block;
    color: #c0392b;
    font-weight: 600;
    font-size: 16px;
    padding-bottom: 6px;
`

const TextTime = styled.p`
    font-weight: 600;
    padding: 6px 0 20px;
`

const CardReview = ({ data }: { data: ReviewInfo }) => {
    return (
        <Group>
            <Flex gap={10}>
                <Avatar src={avatarImage} />
                <div>
                    <Name>{data.account?.account_name}</Name>
                    <Rate allowHalf defaultValue={data.review_ratings} style={{ fontSize: 20 }} disabled />
                    <TextTime>{convertDate((data.updatedAt as Date).toString())}</TextTime>
                </div>
            </Flex>
            <Typography.Paragraph
                ellipsis={{ rows: 4, expandable: false }}
                style={{ paddingLeft: 20 }}
            >
                <HtmlContent htmlContent={data.review_content} />
            </Typography.Paragraph>
        </Group>
    )
}

export default CardReview