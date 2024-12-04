import { DollarOutlined, EyeOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons"
import { Flex } from "antd"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import BuyAPI from "~/services/actions/buy"
import { PATH } from "~/services/constants/navbarList"
import { DocumentInfo } from "~/services/types/document"

const BoxDoc = styled.div`
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-top: 15px;
    display: block; 
    color: #000;

    h4 {
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
    }

    p {
        font-weight: 16px;
        display: block;
        display: -webkit-box;
        max-width: 100%;
        padding-bottom: 20px;
        margin: 0 auto;
        line-height: 1;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const Group = styled.span`
    cursor: default;
    padding: 2px 10px;

    a {
        color: #000;
    }
`

const CardDocument = ({ data }: { data: DocumentInfo }) => {
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
        <BoxDoc>
            <h4>{data.document_title}</h4>
            <p>{data.document_content}</p>
            <Flex gap={10}>
                <Group>
                    <VerticalAlignBottomOutlined /> {count}
                </Group>
                <Group>
                    <Link to={PATH.DETAIL_DOCUMENT.replace(':id', data.document_Id as string)}>
                        <EyeOutlined />
                    </Link>
                </Group>
                <Group>
                    <DollarOutlined /> {data.document_score}
                </Group>
            </Flex>
        </BoxDoc>
    )
}

export default CardDocument