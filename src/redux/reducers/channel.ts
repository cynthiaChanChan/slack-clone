import { ActionTypes } from "../actions/types";
import { Channel } from "../../components/SidePanel/Channels";
import { ChannelAction } from "../actions/channel";

export type ChannelState = {
    currentChannel: Channel | null;
};

const initialUserState: ChannelState = {
    currentChannel: null,
};

const channelReducer = (state = initialUserState, action: ChannelAction) => {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload,
            };

        default:
            return state;
    }
};

export default channelReducer;
