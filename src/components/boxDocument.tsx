import { DollarOutlined, EyeOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import { Card } from "antd"
import { Link } from "react-router-dom"
import styled from "styled-components"
import ViewIcon from "~/components/viewIcon"
import { PATH } from "~/services/constants/navbarList"
import { DocumentInfo } from "~/services/types/document"

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

const BoxDocument = ({ data }: { data: DocumentInfo }) => {
    return (
        <Card
            style={{ width: '100%' }}
            cover={
                <CardTop>
                    <ViewIcon
                        format={data.format.format_name as string}
                        url={data.document_url}
                    />
                </CardTop>
            }
            actions={[
                <Group>
                    <VerticalAlignBottomOutlined /> 0
                </Group>,
                <Group>
                    <Link to={PATH.DETAIL_DOCUMENT.replace(':id', data.document_Id as string)}>
                        <EyeOutlined />
                    </Link>
                </Group>,
                <Group>
                    <DollarOutlined /> {data.document_score === 0 ? 'free' : data.document_score}
                </Group>
            ]}
        >
            <Title>{data.document_title}</Title>
        </Card>
    )
}

export default BoxDocument