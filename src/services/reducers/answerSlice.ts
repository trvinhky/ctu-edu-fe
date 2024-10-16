import { createSlice } from '@reduxjs/toolkit';

interface AnswerItem {
    question_Id: string
    option_Id: string
}

type AnswerStateType = {
    answers: AnswerItem[]
}

const initialState: AnswerStateType = {
    answers: []
}

const answerSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        addAnswer: (state, action) => {
            const current = state.answers.filter((answer) => (
                answer.question_Id !== action.payload?.question_Id
            ))
            state.answers = current
            state.answers.push(action.payload)
        }
    }
})

export const { reducer: answerReducer, actions } = answerSlice