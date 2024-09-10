import { MessageOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Flex, Image, Input } from "antd"
import styled from "styled-components"
import Comment from "~/components/comment"

const SubTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
`

const Content = styled.div`
    padding-bottom: 15px;
`

const LessonContent = () => {
    return (
        <>
            <Content>
                <SubTitle>Chương 1: HTML và CSS</SubTitle>
                <Image.PreviewGroup>
                    <Image
                        width={200}
                        src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                    />
                    <Image
                        width={200}
                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    />
                </Image.PreviewGroup>
                <p style={{ paddingTop: '10px' }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus commodi quod unde perspiciatis pariatur autem, nostrum reiciendis corrupti impedit sed nobis obcaecati, voluptas numquam neque soluta minus, officia praesentium. Suscipit?
                </p>
            </Content>
            <div>
                <SubTitle><MessageOutlined /> Thảo luận</SubTitle>
                <Flex gap={10}>
                    <Avatar size="large" icon={<UserOutlined />} />
                    <Input.TextArea rows={4} />
                </Flex>
                <Flex justify="flex-end" style={{ paddingTop: '15px' }}>
                    <Button type="primary">
                        Thêm mới
                    </Button>
                </Flex>
                <div style={{ padding: '20px 0 15px' }}>
                    <Comment isAction={false} isAvatar={true} />
                </div>
            </div>
        </>
    )
}

export default LessonContent