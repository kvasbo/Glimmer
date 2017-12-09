import {
  APPCONTROL_SET_ACTIVE_POSTING_FILTER,
  APPCONTROL_SET_ACTIVE_POSTING_FORUM,
  APPCONTROL_SET_CURRENT_USER,
  APPCONTROL_USER_LOGIN,
  APPCONTROL_SET_CURRENT_TOKEN,
} from '../constants';

const initialState = {
  loggedIn: null,
  activePostingForum: null,
  activeUserId: null,
  activePostingFilter: null,
  token: null,
};

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


    case APPCONTROL_SET_ACTIVE_POSTING_FILTER:

      var newForumState = Object.assign({}, state);

      newForumState.activePostingFilter = action.filter;

      return newForumState;


    case APPCONTROL_SET_CURRENT_USER:

      var userState = Object.assign({}, state);

      userState.activeUserId = action.userId;

      return userState;


    case APPCONTROL_SET_CURRENT_TOKEN:

      var tokenState = Object.assign({}, state);

      tokenState.token = action.token;

      return tokenState;

    default:
      return state;
  }
}

export default AppStatus;
