import { Col, Input, Row, Select } from "antd"
import styled from "styled-components"
import { Option } from "~/services/types/dataType"

const Label = styled.label`
    display: block;
    font-weight: 600;
    padding-bottom: 10px;
`

const FormResource = () => {
    const options: Option[] = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled' },
    ]

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <Label htmlFor="option">
                    Loại file
                </Label>
                <Select
                    defaultValue={options[0].value}
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    options={options}
                    id="option"
                />
            </Col>
            <Col span={12}>
                <Label htmlFor="name">
                    Chọn file
                </Label>
                <Input type="file" id="name" />
            </Col>
        </Row>
    )
}

export default FormResource