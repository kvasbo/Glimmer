import {ADD_POST_UNREAD_BATCH} from "../constants";

function ForumUnread(state = {}, action) {
    switch (action.type) {

        case ADD_POST_UNREAD_BATCH:

            if (action.replace === true) {
                var newState = Object.assign({});
            }
            else {
                var newState = Object.assign({}, state);
            }

            for (let i = 0; i < action.posts.length; i++) {
                newState[action.posts[i].id] = action.posts[i];
            }

            return newState;

        default:
            return state
    }

}

export default ForumUnread