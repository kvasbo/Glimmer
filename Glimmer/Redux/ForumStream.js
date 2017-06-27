import {ADD_POST_STREAM} from "./constants";

const initialState = {
    posts: []
}

function ForumStream(state = initialState, action) {
    switch (action.type) {
        case ADD_POST_STREAM:
            return Object.assign({}, state, {
                posts: [
                    ...state.posts,
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