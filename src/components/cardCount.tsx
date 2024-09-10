import { CaretRightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface Data {
    color?: string
    href: string;
    count: number;
    title: string;
}

const Wrapper = styled.div<{ $color?: string }>`
    background-color: ${props => props.$color || "#34495e"};
    border-radius: 5px;
    overflow: hidden;
    color: #fff;
`

const Title = styled.span`
    font-size: 18px;
    font-weight: 600;
`

const NumberTag = styled.h4`
    font-size: 35px;
    font-weight: 600;
    text-align: center;
`

const More = styled(Link)`
    display: block;
    width: 100%;
    border: none;
    padding: 8px 0;
    background-color: #ecf0f1;
    text-align: center;
    color: #000;
    transition: 0.3s;

    &:hover {
        color: #000;
        opacity: 0.8;
    }
`

const CardCount = (props: Data) => {
    return (
        <Wrapper $color={props.color}>
            <div style={{ padding: '10px' }}>
                <Title>
                    {props.title}
                </Title>
                <NumberTag>
                    {props.count}
                </NumberTag>
            </div>
            <More to={props.href}>
                Xem thêm <CaretRightOutlined />
            </More>
        </Wrapper>
    )
}

export default CardCount