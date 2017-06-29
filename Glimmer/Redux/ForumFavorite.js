import {ADD_POST_FAVORITES} from "./constants";

const initialState = {
    posts: []
}

function ForumFavorite(state = initialState, action) {
    switch (action.type) {
        case ADD_POST_FAVORITES:

            //Ensure unique IDs by removing any old posts with this id.
            const newPosts = state.posts.filter((post) => {
                if (post.data.id === action.post.id) {
                    return false;
                }
                else {
                    return true;
                }
            });

            //Create return object
            return Object.assign({}, state, {
                posts: [
                    ...newPosts,
                    {
                        data: action.post
                    }
                ]
            })

        default:
            return state
    }

}

export default ForumFavorite