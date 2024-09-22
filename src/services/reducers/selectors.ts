import { RootState } from "./index";

export const accountInfoSelector = (state: RootState) => state.account.info;
export const accountIsLoginSelector = (state: RootState) => state.account.isLogin;
export const accountTokenSelector = (state: RootState) => state.account.token;
export const accountRoleSelector = (state: RootState) => state.account.role;