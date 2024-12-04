import { createSlice } from '@reduxjs/toolkit';
import { Account } from '~/services/types/account';

type AccountStateType = {
    info?: Account
    token?: string
}

const initialState: AccountStateType = {
    info: undefined,
    token: undefined
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        loginAccount: (state, action) => {
            state.token = action.payload;
        },
        logOut: (state) => {
            state.info = undefined
            state.token = undefined
        },
        setInfo: (state, action) => {
            state.info = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
    }
})

export const {
    loginAccount,
    logOut,
    setInfo,
    setToken
} = accountSlice.actions

export default accountSlice.reducer