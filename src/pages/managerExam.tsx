import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Pagination } from "antd"
import { SearchProps } from "antd/es/input";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import styled from "styled-components";
import ExamBox from "~/components/examBox";
import { BoxTitle } from "~/services/constants/styled"

const { Search } = Input;

const Wrapper = styled.div`
    padding-top: 15px;
`

const ManagerExam = () => {
    const [searchValue, setSearchValue] = useState<string>()

    const title = 'Danh sách bài thi'
    useEffect(() => {
        document.title = title
    }, [])

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(info?.source, value);
        setSearchValue(value)
    }

    return (
        <>
            <BoxTitle>
                {title}
            </BoxTitle>
            <Flex justify="flex-end" gap={10}>
                <Search
                    placeholder="Tìm kiếm"
                    onSearch={onSearch}
                    style={{ width: 300 }}
                    value={searchValue}
                    enterButton
                />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#27ae60' }}
                >
                    <Link to='/exam-create/dd'>
                        <PlusOutlined />
                    </Link>
                </Button>
            </Flex>
            <Wrapper>
                <ExamBox />
            </Wrapper>
            <Wrapper>
                <ExamBox />
            </Wrapper>
            <Flex align='center' justify='center' style={{ paddingTop: 20 }}>
                <Pagination defaultCurrent={1} total={50} />
            </Flex>
        </>
    )
}

export default ManagerExam