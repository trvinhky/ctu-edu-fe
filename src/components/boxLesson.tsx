import { DollarOutlined, EyeOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import { Card } from "antd"
import { Link } from "react-router-dom"
import styled from "styled-components"
import ViewIcon from "~/components/viewIcon"
import { PATH } from "~/services/constants/navbarList"
import { LessonInfo } from "~/services/types/lesson"

const CardTop = styled.div`
    font-size: 60px;
    text-align: center;
`

const Title = styled.h4`
    font-size: 20px;
    font-weight: 600;
`

const Group = styled.span`
    cursor: default;
`

const BoxLesson = ({ data }: { data: LessonInfo }) => {
    return (
        <Card
            style={{ width: '100%' }}
            cover={
                <CardTop>
                    <ViewIcon
                        category={data.category.category_name as string}
                        url={data.lesson_url}
                    />
                </CardTop>
            }
            actions={[
                <Group>
                    <VerticalAlignBottomOutlined /> 0
                </Group>,
                <Group>
                    <Link to={PATH.DETAIL_LESSON.replace(':id', data.lesson_Id as string)}>
                        <EyeOutlined />
                    </Link>
                </Group>,
                <Group>
                    <DollarOutlined /> {data.lesson_score === 0 ? 'free' : data.lesson_score}
                </Group>
            ]}
        >
            <Title>{data.lesson_title}</Title>
        </Card>
    )
}

export default BoxLesson