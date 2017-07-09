import {FORUMPOST_COMMENTS_ADD, FORUMPOST_COMMENTS_SET_ACTIVE_PAGE} from "./constants";

const initialState = {}

const initialPostState = {page: {}, activePage: 1}

function ForumPostComment(state = initialState, action) {
    switch (action.type) {

        case FORUMPOST_COMMENTS_ADD:

            //Create a copy
            var newState = Object.assign({}, state);

            //Ensure that we have the post id defined as an object
            if (typeof newState[action.postId] === "undefined") {
                newState[action.postId] = initialPostState;
            }

            newState[action.postId].page[action.page] = {
                updated: new Date(),
                loading: false,
                comments: action.comments
            };

            //Return
            return newState;

        case FORUMPOST_COMMENTS_SET_ACTIVE_PAGE:

            //Create a copy
            var newState = Object.assign({}, state);

            //Ensure that we have the post id defined as an object
            if (typeof newState[action.postId] === "undefined") {
                newState[action.postId] = initialPostState;
            }

            newState[action.postId].page[action.page] = {
                updated: new Date(),
                loading: true,
                comments: []
            };

            newState[action.postId].activePage = action.activePage;

            //Start API Fetching the data
            global.arbeidsMaur.forumUpdater.loadCommentsForPost(action.postId, action.activePage);

            return newState;

        default:
            return state
    }

}

export default ForumPostComment