import { ClockCircleOutlined, DollarOutlined, TagOutlined } from '@ant-design/icons'
import cardImg from '~/assets/images/work.jpeg'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled(Link)`
    width: 100%;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    padding: 10px;
    border-radius: 5px;
    overflow: hidden;
    display: block;
    transition: 0.3s;

    &:hover {
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);

        .card-title {
            transition: 0.3s;
            color: #ee8306;
        }
    }
`

const Image = styled.span`
    display: inline-block;
    height: 180px;
    border-radius: 5px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const Title = styled.h4`
    padding: 15px 0;
    font-weight: 600;
    font-size: 18px;
    display: -webkit-box;
    color: #000;
    line-height: 1;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-top: 1px solid #ccc;
`

const Time = styled.span`
    font-weight: 700;
    color: #555;
`

const Price = styled.span`
    display: block;
    font-weight: 600;
    color: #ee8306;
`

const Old = styled(Price)`
    color: #000;
    text-decoration: line-through;
    padding-bottom: 6px;
`

const Card = () => {
    return (
        <Wrapper to='/detail/jkjnknbbk' className='card'>
            <Image>
                <img
                    src={cardImg}
                    alt="card img"
                />
            </Image>
            <Title className="card-title">
                Chuyên viên Thiết kế Đồ hoạ & Web
            </Title>
            <Footer>
                <Time>
                    <ClockCircleOutlined /> 12 tháng
                </Time>
                <div>
                    <Old>
                        <DollarOutlined /> 28.200.000đ
                    </Old>
                    <Price>
                        <TagOutlined /> 21.700.000đ
                    </Price>
                </div>
            </Footer>
        </Wrapper>
    )
}

export default Card