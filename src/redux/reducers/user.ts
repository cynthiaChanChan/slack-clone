import { ActionTypes, Action } from "../actions/types";

const initialUserState = {
    currentUser: null,
    isLoading: true,
};

const userReducer = (state = initialUserState, action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: true,
            };
        default:
            return state;
    }
};

export default userReducer;
