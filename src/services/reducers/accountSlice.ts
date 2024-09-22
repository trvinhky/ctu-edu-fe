import { createSlice } from '@reduxjs/toolkit';
import { AccountInfo } from '~/services/types/account';

type AccountStateType = {
    info?: AccountInfo
    token: string
}

const initialState: AccountStateType = {
    info: undefined,
    token: localStorage.getItem('token') ?? ''
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        LoginAccount: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload)
        },
        LogOut: (state) => {
            state.info = undefined;
            state.token = ''
            localStorage.removeItem('token');
        },
        setInfo: (state, action) => {
            state.info = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload.token)
        },
    }
})

export const { reducer: accountReducer, actions } = accountSlice