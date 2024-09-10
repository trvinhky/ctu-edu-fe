import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Input, Pagination, Row, Select } from "antd"
import { useEffect } from "react"
import Card from "~/components/card";
import { BoxTitle } from "~/services/constants/styled";
import { Option } from "~/services/types/dataType";

type FieldType = {
    role?: string;
    title?: string;
};

const Search = () => {
    useEffect(() => {
        document.title = 'Tìm kiếm khóa học'
    }, [])

    const options: Option[] = [
        { value: '', label: 'lĩnh vực' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled' },
    ]

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <>
            <BoxTitle>
                Kết quả tìm kiếm
            </BoxTitle>
            <Form
                style={{ paddingBottom: '10px' }}
            >
                <Flex
                    align='center'
                    justify='flex-end'
                    gap={10}
                    style={{ marginBottom: '15px' }}
                >
                    <Form.Item<FieldType>
                        name="title"
                        style={{
                            marginBottom: 0,
                            width: '100%',
                        }}
                    >
                        <Input placeholder='Tên khóa học...' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="role"
                        style={{ marginBottom: 0 }}
                    >
                        <Select
                            style={{ width: 120 }}
                            placeholder="chọn lĩnh vực"
                            onChange={handleChange}
                            options={options}
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                    >
                        <SearchOutlined />
                    </Button>
                </Flex>
            </Form>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={6}>
                    <Card />
                </Col>
                <Col span={24}>
                    <Flex
                        align='center'
                        justify='center'
                        style={{ paddingTop: '10px' }}
                    >
                        <Pagination
                            defaultCurrent={1}
                            total={50}
                        />
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export default Search