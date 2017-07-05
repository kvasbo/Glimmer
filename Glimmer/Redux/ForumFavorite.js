import {ADD_POST_FAVORITES_BATCH} from "./constants";

function ForumFavorite(state = {}, action) {
    switch (action.type) {

        case ADD_POST_FAVORITES_BATCH:

            var newState = Object.assign({}, state);

            for(var i = 0; i < action.posts.length; i++)
            {
                newState[action.posts[i].id] = action.posts[i];
            }

            return newState;


        default:
            return state
    }

}

export default ForumFavorite