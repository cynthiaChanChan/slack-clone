import { ActionTypes } from "../actions/types";
import { Channel } from "../../components/SidePanel/Channels";
import { ChannelAction } from "../actions/channel";

export type ChannelState = {
    currentChannel: Channel | null;
    isPrivateChannel: Channel | boolean;
};

const initialUserState: ChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
};

const channelReducer = (state = initialUserState, action: ChannelAction) => {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload,
                isPrivateChannel: false,
            };
        case ActionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload,
            };

        default:
            return state;
    }
};

export default channelReducer;
