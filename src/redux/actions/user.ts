import { ActionTypes } from "./types";

export type SetUserAction = {
    type: ActionTypes.SET_USER;
    payload: firebase.User;
};

export const setUser = (user: firebase.User) => {
    return {
        type: ActionTypes.SET_USER,
        payload: user,
    };
};
