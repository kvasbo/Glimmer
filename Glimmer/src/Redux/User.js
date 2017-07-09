import {USERS_ADD_USER_BATCH} from "./constants";

const initialState = {

}

function User(state = initialState, action) {

    switch (action.type) {

        case USERS_ADD_USER_BATCH:

            var newState = Object.assign({}, state);

            for(var i = 0; i < action.users.length; i++)
            {
                newState[action.users[i].id] = action.users[i];
            }

            return newState;


        default:
            return state
    }

}

export default User