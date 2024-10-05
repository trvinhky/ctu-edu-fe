import { ClockCircleOutlined } from '@ant-design/icons'
import cardImg from '~/assets/images/work.jpeg'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Tag } from 'antd'
import { PATH } from '~/services/constants/navbarList'
import { CourseInfo } from '~/services/types/course'
import { convertDate, convertUrl } from '~/services/constants'

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
    position: relative;

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

const Time = styled(Tag)`
    font-weight: 700;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;
`

const Card = ({ data }: { data: CourseInfo }) => {
    return (
        <Wrapper to={`${PATH.DETAIL.replace(':id', data.course_Id)}`} className='card'>
            <Image>
                <img
                    src={data.course_image ? convertUrl(data?.course_image) : cardImg}
                    alt="card img"
                />
                <Time color="green">
                    <ClockCircleOutlined /> {data?.updatedAt && convertDate(data?.updatedAt.toString())}
                </Time>
            </Image>
            <Title className="card-title">
                {data.course_name}
            </Title>
            <Footer style={{ justifyContent: 'center' }}>
                <Tag color="blue">{data.subject?.subject_name}</Tag>
            </Footer>
        </Wrapper>
    )
}

export default Card