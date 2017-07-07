import {
    FORUMPOST_COMMENTS_ADD,
    FORUMPOST_COMMENTS_SET_ACTIVE_PAGE
} from "./constants";

const initialState = {}

const initialPostState = {page: {}, numberOfPages: null, activePage: null}

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
            return newState

        case FORUMPOST_COMMENTS_SET_ACTIVE_PAGE:

            //Create a copy
            var newState = Object.assign({}, state);

            //Ensure that we have the post id defined as an object
            if (typeof newState[action.postId] === "undefined") {
                newState[action.postId] = initialPostState;
            }

            //Change the state of the currently chosen page to loading, and start load.
            if (typeof(newState[action.postId]).page[action.activePage] === "undefined") {
                newState[action.postId].page[action.activePage] = {updated: null, loading: true, comments: []};
            }
            else {
                newState[action.postId].page[action.activePage].loading = true;
            }

            //Start API Fetching the data
            global.arbeidsMaur.forumUpdater.loadCommentsForPost(action.postId, action.activePage);

            newState[action.postId].activePage = action.activePage;

            return newState;

        default:
            return state
    }

}

export default ForumPostComment