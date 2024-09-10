import { useState } from "react";
import styled from "styled-components"
import { Checkbox, GetProp, Image, Radio, type RadioChangeEvent } from 'antd';

const Wrapper = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
`

const Title = styled.h5`
    font-weight: 600;
    padding-bottom: 10px;

    span {
        color: red;
    }
`

const RadioCustom = styled(Radio)`
    display: block;
    width: 100%;
`

const CheckboxCustom = styled(Checkbox)`
    width: 100%;
`

const Space = styled.span`
    display: block;
    padding: 8px;
`

const Question = (
    {
        isMultiple
    }: {
        isMultiple?: boolean
    }
) => {
    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const onChangeMultiple: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    return (
        <Wrapper>
            <Title>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta consectetur deserunt id, accusantium quae ullam minima voluptatem placeat corporis iste, sint debitis nostrum, iusto praesentium itaque quo nihil sequi incidunt. <span>(0.25đ)</span>
            </Title>
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
            <Space />
            {
                isMultiple ?
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChangeMultiple}>
                        <CheckboxCustom value="A">A</CheckboxCustom>
                        <CheckboxCustom value="B">B</CheckboxCustom>
                        <CheckboxCustom value="C">C</CheckboxCustom>
                        <CheckboxCustom value="D">D</CheckboxCustom>
                    </Checkbox.Group> :
                    <Radio.Group style={{ width: '100%' }} onChange={onChange} value={value}>
                        <RadioCustom value={1}>A</RadioCustom>
                        <RadioCustom value={2}>B</RadioCustom>
                        <RadioCustom value={3}>C</RadioCustom>
                        <RadioCustom value={4}>D</RadioCustom>
                    </Radio.Group>
            }
        </Wrapper>
    )
}

export default Question