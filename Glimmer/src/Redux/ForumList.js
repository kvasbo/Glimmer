import {FORUMLIST_ADD_FORUM, FORUMLIST_REPLACE} from "./constants";

function ForumList(state = {forums:[]}, action) {
    switch (action.type) {
        case FORUMLIST_ADD_FORUM:

            return {
                ...state,
                forums: [...state.forums, action.forum]
            }

        case FORUMLIST_REPLACE:

            return {
                ...state,
                forums: action.forums
            }


        default:
            return state;
    }
}

export default ForumList