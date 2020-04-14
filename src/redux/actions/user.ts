import { ActionTypes } from "./types";

export type SetUserAction = {
    type: ActionTypes.SET_USER;
    payload: {
        currentUser: firebase.User;
    };
};

export const setUser = (user: firebase.User) => {
    return {
        type: ActionTypes.SET_USER,
        payload: {
            currentUser: user,
        },
    };
};
