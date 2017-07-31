import {ADD_POST_BATCH} from "../constants";

function ForumPosts(state = {}, action) {
    switch (action.type) {

        case ADD_POST_BATCH:

            var newState = Object.assign({}, state);

            for (let i = 0; i < action.posts.length; i++) {
                if(action.posts[i] !== null)
                {
                    newState[action.posts[i].id] = action.posts[i];
                }
            }

            return newState;

        default:
            return state
    }

}

export default ForumPosts