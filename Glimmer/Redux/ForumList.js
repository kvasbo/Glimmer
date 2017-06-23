import {FORUMLIST_ADD_FORUM, FORUMLIST_REPLACE} from "./constants";

function ForumList(state = {}, forum) {
    switch (forum.type) {
        case FORUMLIST_REPLACE:
            return forum.forumList;
        default:
            return state;
    }
}

export default ForumList