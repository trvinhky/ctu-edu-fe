import { RootState } from "./index";

export const accountInfoSelector = (state: RootState) => state.account.info;
export const accountTokenSelector = (state: RootState) => state.account.token;
export const answersSelector = (state: RootState) => state.answer.answers;