import {ADD_POST_STREAM} from "./constants";

const initialState = {
    posts: []
}

function ForumStream(state = initialState, action) {
    switch (action.type) {
        case ADD_POST_STREAM:

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

export default ForumStream