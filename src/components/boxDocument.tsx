import { DollarOutlined, EyeOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import { Card } from "antd"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import ViewIcon from "~/components/viewIcon"
import BuyAPI from "~/services/actions/buy"
import { PATH } from "~/services/constants/navbarList"
import { DocumentInfo } from "~/services/types/document"

const CardTop = styled.div`
    font-size: 60px;
    text-align: center;
`

const Title = styled.h4`
    font-size: 20px;
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
`

const Group = styled.span`
    cursor: default;
`

const BoxDocument = ({ data }: { data: DocumentInfo }) => {
    const [count, setCount] = useState<number>(0)

    useEffect(() => {
        if (data.document_Id) {
            getCount(data.document_Id)
        }
    }, [data.document_Id])

    const getCount = async (id: string) => {
        try {
            const { status, data } = await BuyAPI.getAll({
                document: id
            })
            if (status === 201) {
                setCount(data.count)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Card
            style={{ width: '100%', height: '100%' }}
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
                    <VerticalAlignBottomOutlined /> {count}
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