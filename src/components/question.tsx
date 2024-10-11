import { useState } from "react";
import styled from "styled-components"
import { Checkbox, GetProp, Radio, type RadioChangeEvent } from 'antd';
import { QuestionInfo } from "~/services/types/question";
import ViewURL from "~/components/viewURL";
import { convertUrl } from "~/services/constants";

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
        questionInfo,
        score
    }: {
        questionInfo: QuestionInfo,
        score?: number
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
                {questionInfo.question_content} {score && <span>({score}đ)</span>}
            </Title>
            {
                questionInfo.question_url &&
                <ViewURL
                    category={questionInfo.category?.category_name as string}
                    url={convertUrl(questionInfo.question_url)}
                />
            }
            <Space />
            {
                questionInfo.type.type_name.toLocaleLowerCase().indexOf('one') !== -1 ?
                    <Radio.Group style={{ width: '100%' }} onChange={onChange} value={value}>
                        {
                            questionInfo.options?.map((opt) => (
                                <RadioCustom
                                    key={opt.option_Id}
                                    value={opt.option_Id}
                                >{opt.option_content}</RadioCustom>
                            ))
                        }
                    </Radio.Group> :
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChangeMultiple}>
                        {
                            questionInfo.options?.map((opt) => (
                                <CheckboxCustom
                                    key={opt.option_Id}
                                    value={opt.option_Id}
                                >{opt.option_content}</CheckboxCustom>
                            ))
                        }
                    </Checkbox.Group>
            }
        </Wrapper>
    )
}

export default Question