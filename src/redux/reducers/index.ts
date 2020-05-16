import { combineReducers } from "redux";
import userReducer, { UserState } from "./user";
import channelReducer, { ChannelState } from "./channel";

export type StoreState = {
    user: UserState;
    channel: ChannelState;
};

export default combineReducers<StoreState>({
    user: userReducer,
    channel: channelReducer,
});
