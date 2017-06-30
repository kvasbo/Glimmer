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
            newState = Object.assign({}, state, {
                posts: [
                    ...newPosts,
                    {
                        data: action.post
                    }
                ]
            })

            //Sort
            newState.posts.sort((x,y) => {
                    xd = new Date(x.data.updated_at);
                    yd = new Date(y.data.updated_at);
                    return yd - xd;
            })

            return newState;

        default:
            return state
    }

}

export default ForumFavorite