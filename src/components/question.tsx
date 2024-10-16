import { useState } from "react";
import styled from "styled-components"
import { Radio, type RadioChangeEvent } from 'antd';
import { QuestionInfo } from "~/services/types/question";
import ViewURL from "~/components/viewURL";
import { convertUrl } from "~/services/constants";
import { actions as actionsAnswer } from '~/services/reducers/answerSlice';
import { useDispatch, useSelector } from "react-redux";
import { answersSelector } from "~/services/reducers/selectors";

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

const Space = styled.span`
    display: block;
    padding: 8px;
`

const Question = (
    {
        questionInfo
    }: {
        questionInfo: QuestionInfo
    }
) => {
    const dispatch = useDispatch();
    const answers = useSelector(answersSelector)
    const findValue = (id: string) => {
        const check = answers.find((answer) => answer.question_Id === id)
        return check?.option_Id
    }

    const [value, setValue] = useState(findValue(questionInfo.question_Id as string));

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
        dispatch(actionsAnswer.addAnswer({
            question_Id: questionInfo.question_Id,
            option_Id: e.target.value
        }))
    };

    return (
        <Wrapper>
            <Title>
                {questionInfo.question_content}
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
                <Radio.Group
                    style={{ width: '100%' }}
                    onChange={onChange}
                    value={value}
                >
                    {
                        questionInfo.options?.map((opt) => (
                            <RadioCustom
                                key={opt.option_Id}
                                value={opt.option_Id}
                            >{opt.option_content}</RadioCustom>
                        ))
                    }
                </Radio.Group>
            }
        </Wrapper>
    )
}

export default Question