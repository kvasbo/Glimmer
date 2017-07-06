import {APPCONTROL_USER_LOGIN, APPCONTROL_SET_ACTIVE_POSTING_FORUM} from "./constants";

const initialState = {
    loggedIn: null,
    activePostingForum: null,
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

        default:
            return state
    }

}

export default AppStatus