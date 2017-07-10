import {APPCONTROL_USER_LOGIN, APPCONTROL_SET_ACTIVE_POSTING_FORUM, APPCONTROL_SET_CURRENT_USER} from "./constants";

const initialState = {
    loggedIn: null,
    activePostingForum: null,
    activeUserId: null,
}

function AppStatus(state = initialState, action) {

    switch (action.type) {

        case APPCONTROL_USER_LOGIN:

            var newLoginState = Object.assign({}, state);

            newLoginState.loggedIn = action.status;

            return newLoginState;

        case APPCONTROL_SET_ACTIVE_POSTING_FORUM:

            var newForumState = Object.assign({}, state);

            newForumState.activePostingForum = action.forumId;

            return newForumState;

        case APPCONTROL_SET_CURRENT_USER:

            var userState = Object.assign({}, state);

            userState.activeUserId = action.userId;

            return userState;

        default:
            return state
    }

}

export default AppStatus