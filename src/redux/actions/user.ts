import { ActionTypes } from "./types";

export type UserAction = {
    type: ActionTypes;
    payload: firebase.User;
};

export type ClearUserAction = {
    type: ActionTypes.ClEAR_USER;
};

export const setUser = (user: firebase.User) => {
    return {
        type: ActionTypes.SET_USER,
        payload: user,
    };
};

export const clearUser = () => {
    return {
        type: ActionTypes.ClEAR_USER,
    };
};
