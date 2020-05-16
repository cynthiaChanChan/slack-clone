import { ActionTypes } from "../actions/types";
import { UserAction } from "../actions/user";

export type UserState = {
    currentUser: firebase.User | null;
    isLoading: boolean;
};

const initialUserState: UserState = {
    currentUser: null,
    isLoading: true,
};

const userReducer = (state = initialUserState, action: UserAction) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isLoading: false,
            };
        case ActionTypes.ClEAR_USER:
            return {
                ...state,
                currentUser: null,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default userReducer;
