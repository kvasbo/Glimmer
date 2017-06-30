import {FORUMPOST_COMMENT_ADD} from "./constants";

const initialState = {
    posts: {}
}

function ForumPostComment(state = initialState, action) {
    switch (action.type) {

        case FORUMPOST_COMMENT_ADD:

           // console.log(action);

            //Create a copy
            var newState = Object.assign({}, state);

            //Ensure that we have the post id defined as an array
            if(typeof newState.posts[action.postId] === "undefined")
            {
                newState.posts[action.postId] = [];
            }

            //Ensure unique IDs by removing any old posts with this id.
            const newPosts = newState.posts[action.postId].filter((comment) => {
                if (comment.id === action.comment.id) {
                    return false;
                }
                else {
                    return true;
                }
            });

            //Add the post to the list
            newState.posts[action.postId] = [...newPosts, action.comment];

            //Sort by created date desc
            newState.posts[action.postId].sort((x, y) => {
                xd = new Date(x.created_at);
                yd = new Date(y.created_at);
                return yd - xd;
            })

            //Return
            return newState

        default:
            return state
    }

}

export default ForumPostComment