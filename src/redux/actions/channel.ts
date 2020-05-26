import { ActionTypes } from "./types";
import { Channel } from "../../components/SidePanel/Channels";

export type ChannelAction = {
    type: ActionTypes;
    payload: Channel;
};

export const setCurrentChannel = (channel: Channel) => {
    return {
        type: ActionTypes.SET_CURRENT_CHANNEL,
        payload: channel,
    };
};

export const setPrivateChannel = (isPrivateChannel: boolean) => {
    return {
        type: ActionTypes.SET_PRIVATE_CHANNEL,
        payload: isPrivateChannel,
    };
};
