import {FORUMLIST_ADD_FORUM} from "./constants";

function ForumList(state = {}, action) {
    switch (action.type) {
        case FORUMLIST_ADD_FORUM:

            let id = action.forum.id;

            return Object.assign({}, state, {
                [id]: Object.assign({}, state[id], {
                    forum: action.forum
                })
            });


        default:
            return state;
    }
}

export default ForumList