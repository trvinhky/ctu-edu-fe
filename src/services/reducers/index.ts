import { configureStore } from '@reduxjs/toolkit';
import { accountReducer } from '~/services/reducers/accountSlice';
import { answerReducer } from '~/services/reducers/answerSlice';

const store = configureStore({
    reducer: {
        account: accountReducer,
        answer: answerReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>