import { ActionTypes, Action } from "../actions/types";

export type UserState = {
    currentUser: firebase.User | null;
    isLoading: boolean;
};

const initialUserState: UserState = {
    currentUser: null,
    isLoading: true,
};

const userReducer = (state = initialUserState, action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isLoading: false,
            };
        case ActionTypes.ClEAR_USER:
            return {
                ...initialUserState,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default userReducer;
