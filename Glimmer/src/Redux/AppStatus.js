import {APPCONTROL_USER_LOGIN, APPCONTROL_SET_ACTIVE_POSTING_FORUM, APPCONTROL_SET_CURRENT_USER} from "./constants";

const initialState = {
    loggedIn: null,
    activePostingForum: null,
    activeUserId: null,
}

function AppStatus(state = initialState, action) {

    switch (action.type) {

        case APPCONTROL_USER_LOGIN:

            var s = Object.assign({}, state);

            s.loggedIn = action.status;

            return s;

        case APPCONTROL_SET_ACTIVE_POSTING_FORUM:

            var s = Object.assign({}, state);

            s.activePostingForum = action.forumId;

            return s;

        case APPCONTROL_SET_CURRENT_USER:

            var s = Object.assign({}, state);

            s.activeUserId = action.userId;

            return s;

        default:
            return state
    }

}

export default AppStatus