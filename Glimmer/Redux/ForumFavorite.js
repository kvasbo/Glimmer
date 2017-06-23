import {ADD_POST_FAVORITES} from "./constants";


const initialState = {
   posts: []
}

function ForumFavorite(state = initialState, action)
{
    switch (action.type) {
        case ADD_POST_FAVORITES:
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

export default ForumFavorite