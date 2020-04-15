import { combineReducers } from "redux";
import userReducer, { UserState } from "./user";

export type StoreState = {
    user: UserState;
};

export default combineReducers<StoreState>({
    user: userReducer,
});
