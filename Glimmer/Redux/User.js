import {USERS_ADD_USER} from "./constants";

const initialState = {

}

function User(state = initialState, action) {

    switch (action.type) {

        case USERS_ADD_USER:

            let id = action.user.id;

            let newState = Object.assign({}, state);

            newState[id] = action.user;

            return newState;

        default:
            return state
    }

}

export default User