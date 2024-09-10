import { EyeOutlined, FileUnknownOutlined } from "@ant-design/icons"
import { Flex } from "antd"
import { Link } from "react-router-dom"
import styled from "styled-components"
import ButtonDelete from "~/services/utils/buttonDelete"
import ButtonEdit from "~/services/utils/buttonEdit"
import ButtonLinkCustom from "~/services/utils/buttonLinkCustom"

const Wrapper = styled.div`
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
`

const Box = styled.div`
    h4 {
        font-size: 18px;
        font-weight: 600;
    }
`

const ExamBox = () => {
    return (
        <Wrapper>
            <Flex gap={10} justify="space-between" align="flex-start">
                <FileUnknownOutlined style={{ fontSize: '35px' }} />
                <Box>
                    <h4>Bài thi giữa kỳ</h4>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam architecto labore velit accusantium! Placeat assumenda inventore nemo dolorum eaque. Totam, placeat aut? Enim fugiat delectus quasi laborum, laboriosam minus officia.
                    </p>
                    <Flex gap={10} style={{ marginTop: '8px' }}>
                        <span>07:00:00 12/09/2024</span>
                        <span>Thời gian: 60 phút</span>
                        <span>Tổng điểm: 10.0</span>
                    </Flex>
                    <Flex justify="flex-end" gap={10} style={{ paddingTop: '15px' }}>
                        <ButtonLinkCustom href="/exam/dd" shape="default">
                            <EyeOutlined />
                        </ButtonLinkCustom>
                        <Link to="/exam-update/dd">
                            <ButtonEdit />
                        </Link>
                        <ButtonDelete />
                    </Flex>
                </Box>
            </Flex>
        </Wrapper>
    )
}

export default ExamBox