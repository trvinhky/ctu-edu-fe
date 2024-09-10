import { UserOutlined } from "@ant-design/icons"
import { Avatar, Rate, Typography } from "antd"
import styled from "styled-components"
import { Link } from 'react-router-dom';
import ButtonEdit from "~/services/utils/buttonEdit";
import ButtonDelete from "~/services/utils/buttonDelete";

const Wrapper = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 15px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
`

const Name = styled.h4`
    font-weight: 600;
    font-size: 18px;
    text-align: left;
    padding-bottom: 6px;
`

const LinkCourse = styled(Link)`
    display: block;
    text-align: right;
    display: -webkit-box;
    line-height: 1;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 40%;
`

const Action = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
`

const CardReview = ({ isAction }: { isAction?: boolean }) => {
    return (
        <Wrapper>
            {!isAction && <Avatar size={64} icon={<UserOutlined />} />}
            <div style={{ flex: 1 }}>
                <Name>Jack</Name>
                <Rate defaultValue={5} disabled allowHalf />
                <Typography.Paragraph
                    ellipsis={{ rows: 4, expandable: false }}
                    style={{ paddingTop: '6px' }}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium veniam tenetur et iure? Earum magnam quam sit optio deserunt quae? Magnam, nobis quam eius dolorum dicta molestias id voluptatibus quaerat.
                </Typography.Paragraph>
                <LinkCourse to='/'>
                    #Lập trình Web Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste consequuntur non necessitatibus molestias possimus, magnam nemo enim modi repudiandae, iure odit dolorum eum molestiae saepe, debitis ab voluptatem nostrum ipsum.
                </LinkCourse>
            </div>
            {
                isAction &&
                <Action>
                    <ButtonEdit shape="circle" />
                    <ButtonDelete shape="circle" />
                </Action>
            }
        </Wrapper>
    )
}

export default CardReview